import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Checkbox } from "../components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Plus, Edit, Trash2, Search, User as UserIcon, Shield, CheckSquare, Check, Ban } from "lucide-react";
import { useData, type User } from "../contexts/DataContext";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { Pagination } from "../components/ui/pagination";
import { Breadcrumbs } from "../components/ui/breadcrumbs";
import { useConfirm } from "../hooks/useConfirm";
import { useTranslation } from "react-i18next";

const ITEMS_PER_PAGE = 10;

const ROLES = ["Sales", "Reservations", "Operations", "Accounting", "Admin", "Super Admin"];

const ROLE_COLORS: Record<string, string> = {
  Sales: "bg-blue-500",
  Reservations: "bg-green-500",
  Operations: "bg-purple-500",
  Accounting: "bg-orange-500",
  Admin: "bg-red-500",
  "Super Admin": "bg-gray-900",
};

export function UsersPage() {
  const { users, addUser, updateUser, deleteUser } = useData();
  const { user: currentUser } = useAuth();
  const { confirm } = useConfirm();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Sales",
    isActive: true,
  });

  // Check if current user has permission to manage users
  const canManageUsers = currentUser?.role === "Super Admin" || currentUser?.role === "Admin";

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenDialog = (user?: User) => {
    if (!canManageUsers) {
      toast.error("You don't have permission to manage users");
      return;
    }

    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: "",
        email: "",
        role: "Sales",
        isActive: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.role) {
      toast.error(t('common.fillRequiredFields'));
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error(t('common.invalidEmail'));
      return;
    }

    if (editingUser) {
      updateUser(editingUser.id, formData);
      toast.success(t('common.updateSuccess'));
    } else {
      const newUser: User = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
      };
      addUser(newUser);
      toast.success(t('common.createSuccess'));
    }

    handleCloseDialog();
  };

  const handleDelete = async (id: string) => {
    if (!canManageUsers) {
      toast.error(t('common.noPermission'));
      return;
    }

    if (currentUser?.id === id) {
      toast.error(t('users.cannotDeleteOwn'));
      return;
    }

    const confirmed = await confirm(t('users.deleteConfirmDescription'));
    if (confirmed) {
      deleteUser(id);
      toast.success(t('common.deleteSuccess'));
    }
  };

  const handleBulkSetInactive = async () => {
    if (!canManageUsers) {
      toast.error(t('common.noPermission'));
      return;
    }

    if (selectedItems.size === 0) {
      toast.error(t('common.selectAtLeastOne'));
      return;
    }

    if (selectedItems.has(currentUser?.id || "")) {
      toast.error(t('users.cannotDeactivateOwn'));
      return;
    }

    const confirmed = await confirm(t('common.bulkSetInactiveConfirm', { count: selectedItems.size }));
    if (confirmed) {
      selectedItems.forEach(id => {
        const user = users.find(u => u.id === id);
        if (user) {
          updateUser(id, { ...user, isActive: false });
        }
      });
      toast.success(t('common.bulkSetInactiveSuccess', { count: selectedItems.size }));
      setSelectedItems(new Set());
      setBulkMode(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!canManageUsers) {
      toast.error(t('common.noPermission'));
      return;
    }

    if (selectedItems.size === 0) {
      toast.error(t('common.selectAtLeastOne'));
      return;
    }

    if (selectedItems.has(currentUser?.id || "")) {
      toast.error(t('users.cannotDeleteOwn'));
      return;
    }

    const confirmed = await confirm(t('common.bulkDeleteConfirm', { count: selectedItems.size }));
    if (confirmed) {
      selectedItems.forEach(id => deleteUser(id));
      toast.success(t('common.bulkDeleteSuccess', { count: selectedItems.size }));
      setSelectedItems(new Set());
      setBulkMode(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.size === paginatedUsers.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(paginatedUsers.map((user) => user.id)));
    }
  };

  const handleSelectItem = (id: string) => {
    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(id)) {
      newSelectedItems.delete(id);
    } else {
      newSelectedItems.add(id);
    }
    setSelectedItems(newSelectedItems);
  };

  if (!canManageUsers) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('users.title')}</h1>
          <p className="text-gray-600 mt-1">{t('users.subtitle')}</p>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <Shield className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p className="text-lg font-semibold mb-2">{t('users.accessDenied')}</p>
            <p className="text-gray-600">
              {t('users.noPermissionMessage')}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: t('nav.masterData'), href: "/master-data" },
          { label: t('nav.users') },
        ]}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('users.title')}</h1>
          <p className="text-gray-600 mt-1">{t('users.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Bulk Mode Toggle */}
          <Button
            variant={bulkMode ? "default" : "ghost"}
            size="sm"
            onClick={() => {
              setBulkMode(!bulkMode);
              setSelectedItems(new Set());
            }}
            className={bulkMode 
              ? "gap-1.5 bg-blue-600 hover:bg-blue-700 px-3" 
              : "gap-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3"}
            title={bulkMode ? t('common.exitBulkMode') : t('common.enableBulkActions')}
          >
            {bulkMode ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">{t('common.bulkActive')}</span>
              </>
            ) : (
              <>
                <CheckSquare className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">{t('common.bulk')}</span>
              </>
            )}
          </Button>
          
          <Button onClick={() => handleOpenDialog()} className="gap-2">
            <Plus className="h-4 w-4" />
            {t('users.addUser')}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('users.searchAndFilter')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t('users.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
            <Select
              value={roleFilter}
              onValueChange={(val) => {
                setRoleFilter(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('users.filterByRole')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('users.allRoles')}</SelectItem>
                {ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t('users.allUsers')} ({filteredUsers.length})</CardTitle>
            <div className="flex items-center gap-2">
              <Select value={itemsPerPage.toString()} onValueChange={(val) => {
                setItemsPerPage(parseInt(val));
                setCurrentPage(1);
              }}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 {t('common.perPage')}</SelectItem>
                  <SelectItem value="25">25 {t('common.perPage')}</SelectItem>
                  <SelectItem value="50">50 {t('common.perPage')}</SelectItem>
                  <SelectItem value="100">100 {t('common.perPage')}</SelectItem>
                </SelectContent>
              </Select>
              <Badge variant="secondary">{filteredUsers.length} {t('common.total')}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Bulk Actions Bar */}
          {bulkMode && selectedItems.size > 0 && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {selectedItems.size} {t('common.selected')}
                </Badge>
                <span className="text-sm text-gray-600">
                  {t('users.chooseBulkAction')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkSetInactive}
                  className="gap-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 border-orange-300"
                >
                  <Ban className="h-4 w-4" />
                  {t('users.setInactive')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkDelete}
                  className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                  {t('common.delete')}
                </Button>
              </div>
            </div>
          )}
          
          <Table>
            <TableHeader>
              <TableRow>
                {bulkMode && (
                  <TableHead>
                    <Checkbox
                      id="selectAll"
                      checked={selectedItems.size === paginatedUsers.length && paginatedUsers.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                )}
                <TableHead>{t('users.name')}</TableHead>
                <TableHead>{t('common.email')}</TableHead>
                <TableHead>{t('users.role')}</TableHead>
                <TableHead>{t('common.status')}</TableHead>
                <TableHead>{t('users.created')}</TableHead>
                <TableHead className="text-right">{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    {t('users.noUsersFound')}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-gray-50">
                    {bulkMode && (
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.has(user.id)}
                          onCheckedChange={(checked) => handleSelectItem(user.id)}
                          className="mr-2"
                        />
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4 text-gray-600" />
                        <div>
                          <p className="font-medium">{user.name}</p>
                          {currentUser?.id === user.id && (
                            <Badge variant="outline" className="text-xs mt-1">
                              {t('users.you')}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{user.email}</TableCell>
                    <TableCell>
                      <Badge className={ROLE_COLORS[user.role] || "bg-gray-500"}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.isActive ? (
                        <Badge className="bg-green-500">{t('common.active')}</Badge>
                      ) : (
                        <Badge variant="secondary">{t('common.inactive')}</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {currentUser?.id !== user.id && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredUsers.length}
            itemsPerPage={itemsPerPage}
          />
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingUser ? t('users.editUser') : t('users.addNewUser')}</DialogTitle>
            <DialogDescription>
              {editingUser ? t('users.updateUserInfo') : t('users.enterDetailsNewUser')}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  {t('users.fullName')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder={t('users.namePlaceholder')}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  {t('users.emailAddress')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('users.emailPlaceholder')}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">
                  {t('users.role')} <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(val) => setFormData({ ...formData, role: val })}
                >
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  {t('users.roleDescription')}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked as boolean })
                  }
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                  {t('users.activeUserCanLogin')}
                </Label>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                {t('common.cancel')}
              </Button>
              <Button type="submit">{editingUser ? t('users.update') : t('users.create')}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Bulk Actions */}
      {bulkMode && (
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center">
            <CheckSquare className="h-4 w-4 mr-2" />
            <p className="text-sm font-medium">
              {selectedItems.size} selected
            </p>
          </div>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setBulkMode(false)}
            >
              <Ban className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBulkSetInactive}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBulkDelete}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}