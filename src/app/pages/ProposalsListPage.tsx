import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Plus, Search, Eye, Trash2, Copy, CheckSquare, X, Check, Ban } from "lucide-react";
import { useData } from "../contexts/DataContext";
import { toast } from "sonner";
import { Pagination } from "../components/ui/pagination";
import { Checkbox } from "../components/ui/checkbox";
import { ConfirmDialog } from "../components/ui/confirm-dialog";
import { useConfirm } from "../hooks/useConfirm";
import { useTranslation } from "react-i18next";
import { Breadcrumbs } from "../components/ui/breadcrumbs";

const ITEMS_PER_PAGE = 10;

export function ProposalsListPage() {
  const navigate = useNavigate();
  const { proposals, deleteProposal, addProposal, destinations, agencies, users, updateProposal, sources, getSource } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedProposals, setSelectedProposals] = useState<Set<string>>(new Set());
  const confirmDialog = useConfirm();
  const { t } = useTranslation();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{t('proposals.statuses.NEW')}</Badge>;
      case "CONFIRMED":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{t('proposals.statuses.CONFIRMED')}</Badge>;
      case "CANCELLED":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">{t('proposals.statuses.CANCELLED')}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleDuplicate = (proposal: any) => {
    const newProposal = {
      ...proposal,
      id: `${Date.now()}`,
      reference: `TOMS-2024-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "NEW" as const,
      createdAt: new Date().toISOString(),
    };
    addProposal(newProposal);
    toast.success(t('proposals.duplicateSuccess'));
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirmDialog.confirm({
      title: t('proposals.deleteConfirmTitle'),
      description: t('proposals.deleteConfirmDescription'),
      confirmText: t('common.delete'),
      cancelText: t('common.cancel'),
      variant: "destructive",
    });

    if (confirmed) {
      deleteProposal(id);
      toast.success(t('proposals.deleteSuccess'));
    }
  };

  const handleBulkDelete = async () => {
    const confirmed = await confirmDialog.confirm({
      title: t('proposals.bulkDeleteTitle'),
      description: t('proposals.bulkDeleteDescription', { count: selectedProposals.size }),
      confirmText: t('common.delete'),
      cancelText: t('common.cancel'),
      variant: "destructive",
    });

    if (confirmed) {
      selectedProposals.forEach(id => deleteProposal(id));
      toast.success(t('proposals.bulkDeleteSuccess', { count: selectedProposals.size }));
      setSelectedProposals(new Set());
    }
  };

  const handleBulkCancel = async () => {
    const confirmed = await confirmDialog.confirm({
      title: t('proposals.bulkCancelTitle'),
      description: t('proposals.bulkCancelDescription', { count: selectedProposals.size }),
      confirmText: t('proposals.cancel'),
      cancelText: t('common.cancel'),
      variant: "destructive",
    });

    if (confirmed) {
      selectedProposals.forEach(id => {
        const proposal = proposals.find(p => p.id === id);
        if (proposal) {
          updateProposal(id, { ...proposal, status: "CANCELLED" });
        }
      });
      toast.success(t('proposals.bulkCancelSuccess', { count: selectedProposals.size }));
      setSelectedProposals(new Set());
    }
  };

  const handleBulkConfirm = async () => {
    const confirmed = await confirmDialog.confirm({
      title: t('proposals.bulkConfirmTitle'),
      description: t('proposals.bulkConfirmDescription', { count: selectedProposals.size }),
      confirmText: t('proposals.confirm'),
      cancelText: t('common.cancel'),
      variant: "default",
    });

    if (confirmed) {
      selectedProposals.forEach(id => {
        const proposal = proposals.find(p => p.id === id);
        if (proposal) {
          updateProposal(id, { ...proposal, status: "CONFIRMED" });
        }
      });
      toast.success(t('proposals.bulkConfirmSuccess', { count: selectedProposals.size }));
      setSelectedProposals(new Set());
    }
  };

  const toggleBulkMode = () => {
    setBulkMode(!bulkMode);
    setSelectedProposals(new Set());
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProposals(new Set(paginatedProposals.map(p => p.id)));
    } else {
      setSelectedProposals(new Set());
    }
  };

  const toggleSelectProposal = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedProposals);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedProposals(newSelected);
  };

  const filteredProposals = proposals.filter((proposal) => {
    // Search across multiple destinations
    const destNames = proposal.destinationIds
      ?.map(destId => destinations.find(d => d.id === destId)?.name || "")
      .join(" ")
      .toLowerCase() || "";
    
    const matchesSearch = 
      proposal.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      destNames.includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || proposal.status === statusFilter;
    const matchesSource = sourceFilter === "all" || proposal.source === sourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

  const totalPages = Math.ceil(filteredProposals.length / ITEMS_PER_PAGE);
  const paginatedProposals = filteredProposals.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('proposals.title')}</h1>
          <p className="text-gray-600 mt-1">{t('proposals.manageQuotations')}</p>
        </div>
        <Button onClick={() => navigate("/proposals/new")} className="gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          {t('proposals.newProposal')}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('common.search')} & {t('common.filter')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t('proposals.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('proposals.filterByStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('proposals.allStatuses')}</SelectItem>
                <SelectItem value="NEW">{t('proposals.statuses.NEW')}</SelectItem>
                <SelectItem value="CONFIRMED">{t('proposals.statuses.CONFIRMED')}</SelectItem>
                <SelectItem value="CANCELLED">{t('proposals.statuses.CANCELLED')}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('proposals.filterBySource')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('proposals.allSources')}</SelectItem>
                {sources.filter(s => s.isActive).map(source => (
                  <SelectItem key={source.id} value={source.id}>
                    {source.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Proposals Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>{t('proposals.allProposals')} ({filteredProposals.length})</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{t('proposals.resultsCount', { count: filteredProposals.length })}</Badge>
              <Button
                variant={bulkMode ? "default" : "outline"}
                size="sm"
                onClick={toggleBulkMode}
                className="gap-2"
              >
                {bulkMode ? (
                  <>
                    <X className="h-4 w-4" />
                    {t('proposals.exitBulkMode')}
                  </>
                ) : (
                  <>
                    <CheckSquare className="h-4 w-4" />
                    {t('proposals.enableBulkActions')}
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {bulkMode && selectedProposals.size > 0 && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{t('proposals.selectedCount', { count: selectedProposals.size })}</Badge>
                <span className="text-sm text-gray-600">
                  {t('proposals.bulkActionsAvailable')}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkConfirm}
                  className="gap-2 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-300"
                  disabled={selectedProposals.size === 0}
                >
                  <Check className="h-4 w-4" />
                  {t('proposals.confirm')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkCancel}
                  className="gap-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 border-orange-300"
                  disabled={selectedProposals.size === 0}
                >
                  <Ban className="h-4 w-4" />
                  {t('proposals.cancel')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkDelete}
                  className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300"
                  disabled={selectedProposals.size === 0}
                >
                  <Trash2 className="h-4 w-4" />
                  {t('common.delete')}
                </Button>
              </div>
            </div>
          )}
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {bulkMode && (
                        <TableHead className="w-12">
                          <Checkbox
                            checked={selectedProposals.size === paginatedProposals.length && paginatedProposals.length > 0}
                            onCheckedChange={toggleSelectAll}
                          />
                        </TableHead>
                      )}
                      <TableHead className="min-w-[120px]">{t('proposals.reference')}</TableHead>
                      <TableHead className="min-w-[100px]">{t('common.createdAt')}</TableHead>
                      <TableHead className="min-w-[100px]">{t('proposals.source')}</TableHead>
                      <TableHead className="min-w-[120px]">{t('proposals.agency')}</TableHead>
                      <TableHead className="min-w-[150px]">{t('proposals.destination')}</TableHead>
                      <TableHead className="min-w-[120px]">{t('proposals.salesPerson')}</TableHead>
                      <TableHead className="min-w-[100px]">{t('proposals.status')}</TableHead>
                      <TableHead className="text-right min-w-[100px]">{t('common.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedProposals.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={bulkMode ? 9 : 8} className="text-center py-8 text-gray-500">
                          {t('proposals.noProposalsFound')}
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedProposals.map((proposal) => {
                        const proposalDestinations = proposal.destinationIds
                          ?.map(destId => destinations.find(d => d.id === destId)!)
                          .filter(Boolean) || [];
                        
                        const agency = agencies.find(a => a.id === proposal.agencyId);
                        const salesPerson = users.find(u => u.id === proposal.salesPersonId);
                        
                        return (
                        <TableRow key={proposal.id} className="hover:bg-gray-50">
                          {bulkMode && (
                            <TableCell>
                              <Checkbox
                                checked={selectedProposals.has(proposal.id)}
                                onCheckedChange={(checked) => toggleSelectProposal(proposal.id, checked)}
                              />
                            </TableCell>
                          )}
                          <TableCell className="font-medium">{proposal.reference}</TableCell>
                          <TableCell>{new Date(proposal.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="whitespace-nowrap">
                              {getSource(proposal.source)?.name || proposal.source}
                            </Badge>
                          </TableCell>
                          <TableCell>{agency?.name || "-"}</TableCell>
                          <TableCell>
                            {proposalDestinations.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {proposalDestinations.map((dest) => (
                                  <Badge key={dest.id} variant="outline" className="text-xs whitespace-nowrap">
                                    {dest.name}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell>{salesPerson?.name || "-"}</TableCell>
                          <TableCell>{getStatusBadge(proposal.status)}</TableCell>
                          <TableCell className="text-right">
                            {!bulkMode && (
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => navigate(`/proposals/${proposal.id}`)}
                                  title={t('proposals.viewDetails')}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(proposal.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  title={t('common.delete')}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      )})
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredProposals.length}
        itemsPerPage={ITEMS_PER_PAGE}
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={confirmDialog.isOpen}
        onOpenChange={confirmDialog.handleCancel}
        title={confirmDialog.options.title}
        description={confirmDialog.options.description}
        confirmText={confirmDialog.options.confirmText}
        cancelText={confirmDialog.options.cancelText}
        variant={confirmDialog.options.variant}
        onConfirm={confirmDialog.handleConfirm}
      />
    </div>
  );
}