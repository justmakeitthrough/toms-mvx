import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";
import { Checkbox } from "../components/ui/checkbox";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Plus, Edit, Trash2, Search, Radio, CheckSquare, Check, X, Ban } from "lucide-react";
import { useData, type Source } from "../contexts/DataContext";
import { toast } from "sonner";
import { Pagination } from "../components/ui/pagination";
import { Breadcrumbs } from "../components/ui/breadcrumbs";
import { useConfirm } from "../hooks/useConfirm";
import { useTranslation } from "react-i18next";

const ITEMS_PER_PAGE = 10;

export function SourcesPage() {
  const { sources, addSource, updateSource, deleteSource } = useData();
  const { confirm } = useConfirm();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<Source | null>(null);
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
  });

  const filteredSources = sources.filter(
    (source) =>
      source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (source.description && source.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredSources.length / itemsPerPage);
  const paginatedSources = filteredSources.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenDialog = (source?: Source) => {
    if (source) {
      setEditingSource(source);
      setFormData({
        name: source.name,
        description: source.description || "",
        isActive: source.isActive,
      });
    } else {
      setEditingSource(null);
      setFormData({
        name: "",
        description: "",
        isActive: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingSource(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error(t('sources.pleaseEnterName'));
      return;
    }

    if (editingSource) {
      updateSource(editingSource.id, {
        ...formData,
      });
      toast.success(t('common.updateSuccess'));
    } else {
      const newSource: Source = {
        id: `src${Date.now()}`,
        name: formData.name,
        description: formData.description,
        isActive: formData.isActive,
        createdAt: new Date().toISOString(),
      };
      addSource(newSource);
      toast.success(t('common.createSuccess'));
    }

    handleCloseDialog();
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirm(t('sources.deleteConfirmDescription'));

    if (confirmed) {
      deleteSource(id);
      toast.success(t('common.deleteSuccess'));
    }
  };

  const toggleItemSelection = (id: string) => {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedItems(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === paginatedSources.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(paginatedSources.map(s => s.id)));
    }
  };

  const handleBulkActivate = () => {
    selectedItems.forEach(id => {
      updateSource(id, { isActive: true });
    });
    toast.success(t('common.bulkActivateSuccess', { count: selectedItems.size }));
    setSelectedItems(new Set());
  };

  const handleBulkDeactivate = () => {
    selectedItems.forEach(id => {
      updateSource(id, { isActive: false });
    });
    toast.success(t('common.bulkSetInactiveSuccess', { count: selectedItems.size }));
    setSelectedItems(new Set());
  };

  const handleBulkDelete = async () => {
    const confirmed = await confirm(t('common.bulkDeleteConfirm', { count: selectedItems.size }));

    if (confirmed) {
      selectedItems.forEach(id => {
        deleteSource(id);
      });
      toast.success(t('common.bulkDeleteSuccess', { count: selectedItems.size }));
      setSelectedItems(new Set());
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: t('common.manageMasterData'), href: "/master-data" },
          { label: t('sources.title') },
        ]}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('sources.title')}</h1>
          <p className="text-gray-600 mt-1">
            {t('sources.subtitle')}
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          {t('sources.addSource')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>{t('sources.allSources')} ({filteredSources.length})</CardTitle>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={t('sources.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9 w-full sm:w-[250px]"
                />
              </div>
              <Button
                variant={bulkMode ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setBulkMode(!bulkMode);
                  setSelectedItems(new Set());
                }}
              >
                <CheckSquare className="mr-2 h-4 w-4" />
                {t('common.bulk')}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {bulkMode && selectedItems.size > 0 && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900">
                {t('sources.selectedCount', { count: selectedItems.size })}
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleBulkActivate}>
                  <Check className="mr-1 h-3 w-3" />
                  {t('sources.activate')}
                </Button>
                <Button size="sm" variant="outline" onClick={handleBulkDeactivate}>
                  <Ban className="mr-1 h-3 w-3" />
                  {t('sources.deactivate')}
                </Button>
                <Button size="sm" variant="destructive" onClick={handleBulkDelete}>
                  <Trash2 className="mr-1 h-3 w-3" />
                  {t('common.delete')}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setSelectedItems(new Set())}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {bulkMode && (
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedItems.size === paginatedSources.length && paginatedSources.length > 0}
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                  )}
                  <TableHead>{t('sources.sourceName')}</TableHead>
                  <TableHead>{t('common.description')}</TableHead>
                  <TableHead>{t('common.status')}</TableHead>
                  <TableHead>{t('sources.created')}</TableHead>
                  <TableHead className="text-right">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedSources.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={bulkMode ? 6 : 5} className="text-center py-8 text-gray-500">
                      {t('sources.noSourcesFound')}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedSources.map((source) => (
                    <TableRow key={source.id}>
                      {bulkMode && (
                        <TableCell>
                          <Checkbox
                            checked={selectedItems.has(source.id)}
                            onCheckedChange={() => toggleItemSelection(source.id)}
                          />
                        </TableCell>
                      )}
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Radio className="h-4 w-4 text-teal-600" />
                          {source.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {source.description || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={source.isActive ? "default" : "secondary"}>
                          {source.isActive ? t('common.active') : t('common.inactive')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(source.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(source)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(source.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{t('common.itemsPerPage')}:</span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSource ? t('sources.editSource') : t('sources.addNewSource')}
            </DialogTitle>
            <DialogDescription>
              {editingSource
                ? t('sources.updateSourceInfo')
                : t('sources.enterDetailsNewSource')}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('sources.sourceNameRequired')}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t('sources.namePlaceholder')}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t('common.description')}</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={t('sources.descriptionPlaceholder')}
                  rows={3}
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
                  {t('sources.activeSource')}
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                {t('common.cancel')}
              </Button>
              <Button type="submit">
                {editingSource ? t('common.save') : t('common.add')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}