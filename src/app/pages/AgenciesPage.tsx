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
import { Plus, Edit, Trash2, Search, Building2, CheckSquare, Check, Ban } from "lucide-react";
import { useData, type Agency } from "../contexts/DataContext";
import { toast } from "sonner";
import { Pagination } from "../components/ui/pagination";
import { Breadcrumbs } from "../components/ui/breadcrumbs";
import { useConfirm } from "../hooks/useConfirm";
import { useTranslation } from "react-i18next";

const ITEMS_PER_PAGE = 10;

export function AgenciesPage() {
  const { agencies, addAgency, updateAgency, deleteAgency } = useData();
  const { confirm } = useConfirm();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAgency, setEditingAgency] = useState<Agency | null>(null);
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

  const [formData, setFormData] = useState({
    name: "",
    country: "",
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
    commissionRate: "",
    isActive: true,
  });

  const filteredAgencies = agencies.filter(
    (agency) =>
      agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agency.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agency.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAgencies.length / itemsPerPage);
  const paginatedAgencies = filteredAgencies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenDialog = (agency?: Agency) => {
    if (agency) {
      setEditingAgency(agency);
      setFormData({
        name: agency.name,
        country: agency.country,
        contactPerson: agency.contactPerson,
        contactEmail: agency.contactEmail,
        contactPhone: agency.contactPhone,
        commissionRate: agency.commissionRate,
        isActive: agency.isActive,
      });
    } else {
      setEditingAgency(null);
      setFormData({
        name: "",
        country: "",
        contactPerson: "",
        contactEmail: "",
        contactPhone: "",
        commissionRate: "10",
        isActive: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingAgency(null);
  };

  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.country || !formData.commissionRate) {
      toast.error(t('common.fillRequiredFields'));
      return;
    }

    if (editingAgency) {
      updateAgency(editingAgency.id, formData);
      toast.success(t('common.updateSuccess'));
    } else {
      const newAgency: Agency = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
      };
      addAgency(newAgency);
      toast.success(t('common.createSuccess'));
    }

    handleCloseDialog();
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirm(t('agencies.deleteConfirmDescription'));
    if (confirmed) {
      deleteAgency(id);
      toast.success(t('common.deleteSuccess'));
    }
  };

  const handleBulkSetInactive = async () => {
    if (selectedItems.size === 0) {
      toast.error(t('common.selectAtLeastOne'));
      return;
    }
    
    const confirmed = await confirm(t('common.bulkSetInactiveConfirm', { count: selectedItems.size }));
    if (confirmed) {
      selectedItems.forEach(id => {
        const agency = agencies.find(a => a.id === id);
        if (agency) {
          updateAgency(id, { ...agency, isActive: false });
        }
      });
      toast.success(t('common.bulkSetInactiveSuccess', { count: selectedItems.size }));
      setSelectedItems(new Set());
      setBulkMode(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) {
      toast.error(t('common.selectAtLeastOne'));
      return;
    }
    
    const confirmed = await confirm(t('common.bulkDeleteConfirm', { count: selectedItems.size }));
    if (confirmed) {
      selectedItems.forEach((id) => deleteAgency(id));
      toast.success(t('common.bulkDeleteSuccess', { count: selectedItems.size }));
      setSelectedItems(new Set());
      setBulkMode(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.size === paginatedAgencies.length) {
      setSelectedItems(new Set());
    } else {
      const allIds = new Set(paginatedAgencies.map((agency) => agency.id));
      setSelectedItems(allIds);
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

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: t('nav.masterData'), href: "/master-data" },
          { label: t('nav.agencies') },
        ]}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('agencies.title')}</h1>
          <p className="text-gray-600 mt-1">{t('agencies.subtitle')}</p>
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
            {t('agencies.addAgency')}
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('agencies.searchAgencies')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={t('agencies.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t('agencies.allAgencies')} ({filteredAgencies.length})</CardTitle>
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
              <Badge variant="secondary">{filteredAgencies.length} {t('common.total')}</Badge>
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
                  {t('agencies.chooseBulkAction')}
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
                  {t('agencies.setInactive')}
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
                      checked={selectedItems.size === paginatedAgencies.length && paginatedAgencies.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                )}
                <TableHead>{t('agencies.agencyName')}</TableHead>
                <TableHead>{t('agencies.country')}</TableHead>
                <TableHead>{t('agencies.contactPerson')}</TableHead>
                <TableHead>{t('agencies.emailPhone')}</TableHead>
                <TableHead>{t('agencies.commissionRate')}</TableHead>
                <TableHead>{t('common.status')}</TableHead>
                <TableHead className="text-right">{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedAgencies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    {t('agencies.noAgenciesFound')}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedAgencies.map((agency) => (
                  <TableRow key={agency.id} className="hover:bg-gray-50">
                    {bulkMode && (
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.has(agency.id)}
                          onCheckedChange={() => handleSelectItem(agency.id)}
                        />
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">{agency.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{agency.country}</TableCell>
                    <TableCell>{agency.contactPerson || "-"}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="text-gray-900">{agency.contactEmail || "-"}</p>
                        <p className="text-gray-500">{agency.contactPhone || "-"}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono">
                        {agency.commissionRate}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {agency.isActive ? (
                        <Badge className="bg-green-500">{t('common.active')}</Badge>
                      ) : (
                        <Badge variant="secondary">{t('common.inactive')}</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(agency)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(agency.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
            totalItems={filteredAgencies.length}
            itemsPerPage={itemsPerPage}
          />
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingAgency ? t('agencies.editAgency') : t('agencies.addNewAgency')}
            </DialogTitle>
            <DialogDescription>
              {editingAgency ? t('agencies.updateAgencyInfo') : t('agencies.enterDetailsNewAgency')}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    {t('agencies.agencyName')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder={t('agencies.namePlaceholder')}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">
                    {t('agencies.country')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="country"
                    placeholder={t('agencies.countryPlaceholder')}
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPerson">{t('common.contactPerson')}</Label>
                <Input
                  id="contactPerson"
                  placeholder={t('common.contactPersonPlaceholder')}
                  value={formData.contactPerson}
                  onChange={(e) =>
                    setFormData({ ...formData, contactPerson: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">{t('common.contactEmail')}</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder={t('agencies.emailPlaceholder')}
                    value={formData.contactEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, contactEmail: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone">{t('common.contactPhone')}</Label>
                  <Input
                    id="contactPhone"
                    placeholder={t('agencies.phonePlaceholder')}
                    value={formData.contactPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, contactPhone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="commissionRate">
                  {t('agencies.commissionRateLabel')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="commissionRate"
                  type="number"
                  step="0.01"
                  placeholder={t('agencies.commissionPlaceholder')}
                  value={formData.commissionRate}
                  onChange={(e) =>
                    setFormData({ ...formData, commissionRate: e.target.value })
                  }
                  required
                />
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
                  {t('agencies.activeAgency')}
                </Label>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                {t('common.cancel')}
              </Button>
              <Button type="submit">
                {editingAgency ? t('agencies.update') : t('agencies.create')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}