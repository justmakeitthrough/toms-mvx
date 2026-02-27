import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
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
import { Plus, Edit, Trash2, Plane, Car, Briefcase, X, Truck } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Breadcrumbs } from "../components/ui/breadcrumbs";
import { useConfirm } from "../hooks/useConfirm";
import { useTranslation } from "react-i18next";

type LookupType = "serviceTypes" | "vehicleTypes" | "flightTypes" | "carTypes";

interface LookupItem {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export function GlobalLookupsPage() {
  const { t } = useTranslation();
  const { confirm } = useConfirm();
  const [activeTab, setActiveTab] = useState<LookupType>("serviceTypes");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LookupItem | null>(null);

  // Default lookups
  const [serviceTypes, setServiceTypes] = useState<LookupItem[]>([
    { id: "1", name: "Tour Guide", description: "Professional tour guide services", createdAt: new Date().toISOString() },
    { id: "2", name: "Museum Entry", description: "Museum and attraction tickets", createdAt: new Date().toISOString() },
    { id: "3", name: "Activities", description: "Various tourist activities", createdAt: new Date().toISOString() },
    { id: "4", name: "Meals", description: "Lunch/dinner arrangements", createdAt: new Date().toISOString() },
    { id: "5", name: "Insurance", description: "Travel insurance", createdAt: new Date().toISOString() },
  ]);

  const [vehicleTypes, setVehicleTypes] = useState<LookupItem[]>([
    { id: "1", name: "Sedan (4 PAX)", description: "Compact sedan for 4 passengers", createdAt: new Date().toISOString() },
    { id: "2", name: "Van (7 PAX)", description: "Mini van for 7 passengers", createdAt: new Date().toISOString() },
    { id: "3", name: "Mini Bus (15 PAX)", description: "Mini bus for 15 passengers", createdAt: new Date().toISOString() },
    { id: "4", name: "Bus (30 PAX)", description: "Standard bus for 30 passengers", createdAt: new Date().toISOString() },
    { id: "5", name: "Bus (50 PAX)", description: "Large bus for 50 passengers", createdAt: new Date().toISOString() },
  ]);

  const [flightTypes, setFlightTypes] = useState<LookupItem[]>([
    { id: "1", name: "Domestic", description: "Within country flights", createdAt: new Date().toISOString() },
    { id: "2", name: "International", description: "Between countries", createdAt: new Date().toISOString() },
    { id: "3", name: "Regional", description: "Regional flights", createdAt: new Date().toISOString() },
  ]);

  const [carTypes, setCarTypes] = useState<LookupItem[]>([
    { id: "1", name: "Economy", description: "Compact cars", createdAt: new Date().toISOString() },
    { id: "2", name: "Standard", description: "Mid-size cars", createdAt: new Date().toISOString() },
    { id: "3", name: "Luxury", description: "Premium vehicles", createdAt: new Date().toISOString() },
    { id: "4", name: "SUV", description: "Sport utility vehicles", createdAt: new Date().toISOString() },
    { id: "5", name: "Van", description: "Multi-passenger vans", createdAt: new Date().toISOString() },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const getCurrentList = (): LookupItem[] => {
    switch (activeTab) {
      case "serviceTypes":
        return serviceTypes;
      case "vehicleTypes":
        return vehicleTypes;
      case "flightTypes":
        return flightTypes;
      case "carTypes":
        return carTypes;
    }
  };

  const setCurrentList = (items: LookupItem[]) => {
    switch (activeTab) {
      case "serviceTypes":
        setServiceTypes(items);
        break;
      case "vehicleTypes":
        setVehicleTypes(items);
        break;
      case "flightTypes":
        setFlightTypes(items);
        break;
      case "carTypes":
        setCarTypes(items);
        break;
    }
  };

  const handleOpenDialog = (item?: LookupItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description || "",
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: "",
        description: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      toast.error(t('common.fillRequiredFields'));
      return;
    }

    const currentList = getCurrentList();

    if (editingItem) {
      const updatedList = currentList.map((item) =>
        item.id === editingItem.id
          ? { ...item, name: formData.name, description: formData.description }
          : item
      );
      setCurrentList(updatedList);
      toast.success(t('common.updateSuccess'));
    } else {
      const newItem: LookupItem = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        createdAt: new Date().toISOString(),
      };
      setCurrentList([...currentList, newItem]);
      toast.success(t('common.createSuccess'));
    }

    handleCloseDialog();
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirm(t('globalLookups.deleteConfirmDescription'));
    if (confirmed) {
      const currentList = getCurrentList();
      setCurrentList(currentList.filter((item) => item.id !== id));
      toast.success(t('common.deleteSuccess'));
    }
  };

  const getTabInfo = (type: LookupType) => {
    switch (type) {
      case "serviceTypes":
        return {
          title: t('globalLookups.serviceTypes'),
          description: t('globalLookups.serviceTypesDesc'),
          icon: Briefcase,
          color: "text-purple-600",
        };
      case "vehicleTypes":
        return {
          title: t('globalLookups.vehicleTypes'),
          description: t('globalLookups.vehicleTypesDesc'),
          icon: Truck,
          color: "text-gray-600",
        };
      case "flightTypes":
        return {
          title: t('globalLookups.flightTypes'),
          description: t('globalLookups.flightTypesDesc'),
          icon: Plane,
          color: "text-blue-600",
        };
      case "carTypes":
        return {
          title: t('globalLookups.carTypes'),
          description: t('globalLookups.carTypesDesc'),
          icon: Car,
          color: "text-green-600",
        };
    }
  };

  const currentInfo = getTabInfo(activeTab);
  const Icon = currentInfo.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('globalLookups.title')}</h1>
          <p className="text-gray-600 mt-1">{t('globalLookups.subtitle')}</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as LookupType)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="serviceTypes">
            <Briefcase className="h-4 w-4 mr-2" />
            {t('globalLookups.serviceTypes')}
          </TabsTrigger>
          <TabsTrigger value="vehicleTypes">
            <Truck className="h-4 w-4 mr-2" />
            {t('globalLookups.vehicleTypes')}
          </TabsTrigger>
          <TabsTrigger value="flightTypes">
            <Plane className="h-4 w-4 mr-2" />
            {t('globalLookups.flightTypes')}
          </TabsTrigger>
          <TabsTrigger value="carTypes">
            <Car className="h-4 w-4 mr-2" />
            {t('globalLookups.carTypes')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {/* Info Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gray-100`}>
                    <Icon className={`h-5 w-5 ${currentInfo.color}`} />
                  </div>
                  <div>
                    <CardTitle>{currentInfo.title}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{currentInfo.description}</p>
                  </div>
                </div>
                <Button onClick={() => handleOpenDialog()} className="gap-2">
                  <Plus className="h-4 w-4" />
                  {t('globalLookups.addItem')}
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t('globalLookups.allItems')} ({getCurrentList().length})</CardTitle>
                <Badge variant="secondary">{getCurrentList().length} {t('globalLookups.items')}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('globalLookups.name')}</TableHead>
                    <TableHead>{t('common.description')}</TableHead>
                    <TableHead>{t('users.created')}</TableHead>
                    <TableHead className="text-right">{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getCurrentList().length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                        {t('globalLookups.noItemsFound')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    getCurrentList().map((item) => (
                      <TableRow key={item.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-gray-600">
                          {item.description || <span className="text-gray-400">—</span>}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenDialog(item)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(item.id)}
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? t('globalLookups.editItem') : t('globalLookups.addNewItem')}
            </DialogTitle>
            <DialogDescription>
              {editingItem ? t('globalLookups.updateItemInfo') : t('globalLookups.enterDetailsNewItem')}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  {t('globalLookups.name')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder={t('globalLookups.namePlaceholder')}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t('common.description')}</Label>
                <Input
                  id="description"
                  placeholder={t('globalLookups.descriptionPlaceholder')}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                {t('common.cancel')}
              </Button>
              <Button type="submit">{editingItem ? t('users.update') : t('users.create')}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}