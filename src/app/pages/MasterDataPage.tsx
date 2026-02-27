import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { MapPin, Hotel, Building2, Settings, ArrowRight, List, Radio } from "lucide-react";
import { useData } from "../contexts/DataContext";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { useTranslation } from "react-i18next";

export function MasterDataPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { destinations, hotels, agencies, globalLookups, sources } = useData();

  // Calculate global lookups breakdown by category
  const vehicleTypesCount = globalLookups.filter(l => l.category === "vehicleTypes").length;
  const flightTypesCount = globalLookups.filter(l => l.category === "flightTypes").length;
  const carTypesCount = globalLookups.filter(l => l.category === "carTypes").length;
  const serviceTypesCount = globalLookups.filter(l => l.category === "serviceTypes").length;
  const totalLookupsCount = globalLookups.length;

  const masterDataSections = [
    {
      title: t('masterData.destinationsTitle'),
      description: t('masterData.destinationsDesc'),
      icon: MapPin,
      count: destinations.length,
      color: "bg-blue-100 text-blue-600",
      route: "/master-data/destinations",
    },
    {
      title: t('masterData.hotelsTitle'),
      description: t('masterData.hotelsDesc'),
      icon: Hotel,
      count: hotels.length,
      color: "bg-green-100 text-green-600",
      route: "/master-data/hotels",
    },
    {
      title: t('masterData.agenciesTitle'),
      description: t('masterData.agenciesDesc'),
      icon: Building2,
      count: agencies.length,
      color: "bg-purple-100 text-purple-600",
      route: "/master-data/agencies",
    },
    {
      title: t('masterData.sourcesTitle'),
      description: t('masterData.sourcesDesc'),
      icon: Radio,
      count: sources.length,
      color: "bg-teal-100 text-teal-600",
      route: "/master-data/sources",
    },
    {
      title: t('masterData.lookupsTitle'),
      description: t('masterData.lookupsDesc'),
      icon: List,
      count: totalLookupsCount,
      color: "bg-orange-100 text-orange-600",
      route: "/master-data/lookups",
      breakdown: [
        { label: t('masterData.vehicleTypesBreakdown'), count: vehicleTypesCount },
        { label: t('masterData.flightTypesBreakdown'), count: flightTypesCount },
        { label: t('masterData.carTypesBreakdown'), count: carTypesCount },
        { label: t('masterData.serviceTypesBreakdown'), count: serviceTypesCount },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('masterData.title')}</h1>
        <p className="text-gray-600 mt-1">
          {t('masterData.subtitle')}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {masterDataSections.map((section) => (
          <Card key={section.title} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${section.color}`}>
                  <section.icon className="h-6 w-6" />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(section.route)}
                  className="hover:bg-gray-100"
                >
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="mb-2">{section.title}</CardTitle>
              <p className="text-sm text-gray-600 mb-3">{section.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{section.count}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(section.route)}
                >
                  {t('masterData.manage')}
                </Button>
              </div>
              {section.breakdown && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">{t('masterData.breakdown')}</h4>
                  <ul className="space-y-2">
                    {section.breakdown.map(breakdownItem => (
                      <li key={breakdownItem.label} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{breakdownItem.label}</span>
                        <span className="text-sm font-bold">{breakdownItem.count}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-600" />
            <CardTitle>{t('masterData.aboutTitle')}</CardTitle>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {t('masterData.aboutDesc')}
          </p>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="destinations" className="border-blue-200">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-blue-900">{t('masterData.destinationsAccordionTitle')}</div>
                    <div className="text-xs text-gray-600 font-normal">{t('masterData.destinationsAccordionSubtitle')}</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 ml-11">
                  <p className="text-sm text-blue-800 mb-3">
                    {t('masterData.destinationsContentDesc')}
                  </p>
                  <ul className="text-sm text-blue-700 space-y-1.5 ml-4 list-disc">
                    <li>{t('masterData.destinationsContentPoint1')}</li>
                    <li>{t('masterData.destinationsContentPoint2')}</li>
                    <li>{t('masterData.destinationsContentPoint3')}</li>
                    <li>{t('masterData.destinationsContentPoint4')}</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="hotels" className="border-green-200">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-100 text-green-600">
                    <Hotel className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-green-900">{t('masterData.hotelsAccordionTitle')}</div>
                    <div className="text-xs text-gray-600 font-normal">{t('masterData.hotelsAccordionSubtitle')}</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 ml-11">
                  <p className="text-sm text-green-800 mb-3">
                    {t('masterData.hotelsContentDesc')}
                  </p>
                  <ul className="text-sm text-green-700 space-y-1.5 ml-4 list-disc">
                    <li>{t('masterData.hotelsContentPoint1')}</li>
                    <li>{t('masterData.hotelsContentPoint2')}</li>
                    <li>{t('masterData.hotelsContentPoint3')}</li>
                    <li>{t('masterData.hotelsContentPoint4')}</li>
                    <li>{t('masterData.hotelsContentPoint5')}</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="agencies" className="border-purple-200">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-purple-900">{t('masterData.agenciesAccordionTitle')}</div>
                    <div className="text-xs text-gray-600 font-normal">{t('masterData.agenciesAccordionSubtitle')}</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 ml-11">
                  <p className="text-sm text-purple-800 mb-3">
                    {t('masterData.agenciesContentDesc')}
                  </p>
                  <ul className="text-sm text-purple-700 space-y-1.5 ml-4 list-disc">
                    <li>{t('masterData.agenciesContentPoint1')}</li>
                    <li>{t('masterData.agenciesContentPoint2')}</li>
                    <li>{t('masterData.agenciesContentPoint3')}</li>
                    <li>{t('masterData.agenciesContentPoint4')}</li>
                    <li>{t('masterData.agenciesContentPoint5')}</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="sources" className="border-teal-200">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-teal-100 text-teal-600">
                    <Radio className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-teal-900">{t('masterData.sourcesAccordionTitle')}</div>
                    <div className="text-xs text-gray-600 font-normal">{t('masterData.sourcesAccordionSubtitle')}</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 ml-11">
                  <p className="text-sm text-teal-800 mb-3">
                    {t('masterData.sourcesContentDesc')}
                  </p>
                  <ul className="text-sm text-teal-700 space-y-1.5 ml-4 list-disc">
                    <li>{t('masterData.sourcesContentPoint1')}</li>
                    <li>{t('masterData.sourcesContentPoint2')}</li>
                    <li>{t('masterData.sourcesContentPoint3')}</li>
                    <li>{t('masterData.sourcesContentPoint4')}</li>
                    <li>{t('masterData.sourcesContentPoint5')}</li>
                    <li>{t('masterData.sourcesContentPoint6')}</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="lookups" className="border-orange-200">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                    <List className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-orange-900">{t('masterData.lookupsAccordionTitle')}</div>
                    <div className="text-xs text-gray-600 font-normal">{t('masterData.lookupsAccordionSubtitle')}</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 ml-11">
                  <p className="text-sm text-orange-800 mb-3">
                    {t('masterData.lookupsContentDesc')}
                  </p>
                  <ul className="text-sm text-orange-700 space-y-1.5 ml-4 list-disc">
                    <li><strong>{t('masterData.vehicleTypesBreakdown')}:</strong> {t('masterData.lookupsContentVehicleDesc')}</li>
                    <li><strong>{t('masterData.flightTypesBreakdown')}:</strong> {t('masterData.lookupsContentFlightDesc')}</li>
                    <li><strong>{t('masterData.carTypesBreakdown')}:</strong> {t('masterData.lookupsContentCarDesc')}</li>
                    <li><strong>{t('masterData.serviceTypesBreakdown')}:</strong> {t('masterData.lookupsContentServiceDesc')}</li>
                    <li>{t('masterData.lookupsContentPoint5')}</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="best-practices" className="border-gray-200">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">💡</div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">{t('masterData.bestPracticesTitle')}</div>
                    <div className="text-xs text-gray-600 font-normal">{t('masterData.bestPracticesSubtitle')}</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 ml-11">
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>{t('masterData.bestPracticesPoint1')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>{t('masterData.bestPracticesPoint2')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>{t('masterData.bestPracticesPoint3')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>{t('masterData.bestPracticesPoint4')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>{t('masterData.bestPracticesPoint5')}</span>
                    </li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}