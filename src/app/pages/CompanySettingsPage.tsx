import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Building2, Save, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useData } from "../contexts/DataContext";
import { useTranslation } from "react-i18next";

export function CompanySettingsPage() {
  const { companyInfo, updateCompanyInfo } = useData();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    phone: "",
    email: "",
    website: "",
    taxId: "",
    licenseNumber: "",
    currency: "USD",
  });

  // Update form data when companyInfo changes
  useEffect(() => {
    console.log("CompanyInfo from context:", companyInfo);
    if (companyInfo) {
      setFormData({
        name: companyInfo.name || "",
        address: companyInfo.address || "",
        city: companyInfo.city || "",
        country: companyInfo.country || "",
        postalCode: companyInfo.postalCode || "",
        phone: companyInfo.phone || "",
        email: companyInfo.email || "",
        website: companyInfo.website || "",
        taxId: companyInfo.taxId || "",
        licenseNumber: companyInfo.licenseNumber || "",
        currency: companyInfo.currency || "USD",
      });
    }
  }, [companyInfo]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateCompanyInfo(formData);
    toast.success(t('companySettings.saveSuccess'));
  };

  const handleLoadMockup = () => {
    const mockupData = {
      name: "Mediterranean Explorer Tours",
      address: "Cumhuriyet Caddesi No: 145, Harbiye",
      city: "Istanbul",
      country: "Turkey",
      postalCode: "34367",
      phone: "+90 212 368 4200",
      email: "info@mediterraneanexplorer.com",
      website: "www.mediterraneanexplorer.com",
      taxId: "TR8520147365",
      licenseNumber: "TURSAB-A-8524",
      currency: "USD",
    };
    setFormData(mockupData);
    updateCompanyInfo(mockupData);
    toast.success(t('companySettings.mockupLoadedSuccess'));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('companySettings.title')}</h1>
        <p className="text-gray-600 mt-1">
          {t('companySettings.subtitle')}
        </p>
      </div>

      {/* Company Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-gray-600" />
            <CardTitle>{t('companySettings.companyInformation')}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">{t('companySettings.companyNameRequired')}</Label>
              <Input
                id="companyName"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder={t('companySettings.companyNamePlaceholder')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t('companySettings.emailAddressRequired')}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder={t('companySettings.emailPlaceholder')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{t('companySettings.phoneNumberRequired')}</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder={t('companySettings.phonePlaceholder')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">{t('companySettings.website')}</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleChange("website", e.target.value)}
                placeholder={t('companySettings.websitePlaceholder')}
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">{t('companySettings.addressInformation')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">{t('companySettings.streetAddressRequired')}</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder={t('companySettings.streetAddressPlaceholder')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">{t('companySettings.cityRequired')}</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  placeholder={t('companySettings.cityPlaceholder')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">{t('companySettings.countryRequired')}</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleChange("country", e.target.value)}
                  placeholder={t('companySettings.countryPlaceholder')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">{t('companySettings.postalCode')}</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => handleChange("postalCode", e.target.value)}
                  placeholder={t('companySettings.postalCodePlaceholder')}
                />
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">{t('companySettings.businessInformation')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="taxId">{t('companySettings.taxId')}</Label>
                <Input
                  id="taxId"
                  value={formData.taxId}
                  onChange={(e) => handleChange("taxId", e.target.value)}
                  placeholder={t('companySettings.taxIdPlaceholder')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="licenseNumber">{t('companySettings.licenseNumber')}</Label>
                <Input
                  id="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={(e) => handleChange("licenseNumber", e.target.value)}
                  placeholder={t('companySettings.licenseNumberPlaceholder')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">{t('companySettings.defaultCurrencyRequired')}</Label>
                <Input
                  id="currency"
                  value={formData.currency}
                  onChange={(e) => handleChange("currency", e.target.value)}
                  placeholder={t('companySettings.currencyPlaceholder')}
                />
                <p className="text-xs text-gray-500">
                  {t('companySettings.currencyHelpText')}
                </p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="border-t pt-6 flex justify-end gap-2">
            <Button 
              onClick={handleLoadMockup} 
              variant="outline" 
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              {t('companySettings.loadMockupData')}
            </Button>
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              {t('companySettings.saveChanges')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info Box */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="py-4">
          <p className="text-sm text-blue-800">
            <strong>{t('companySettings.noteLabel')}</strong> {t('companySettings.noteText')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}