import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Plus, Trash2, Copy, Package } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useData } from "../../contexts/DataContext";

interface AdditionalServiceEntry {
  id: number;
  destinationId: string;
  date: string;
  description: string;
  serviceType: string;
  numDays: number;
  numPeople: number;
  currency: string;
  pricePerDay: string;
  totalPrice: number;
  marginType: "percentage" | "fixed";
  margin: string;
}

interface Props {
  entries: AdditionalServiceEntry[];
  onChange: (entries: AdditionalServiceEntry[]) => void;
  inputMethod: "forms" | "table";
  overallMargin: string;
  commission: string;
  selectedDestinations?: string[];
  proposalCurrency?: string;
  proposalStartDate?: string;
  proposalEndDate?: string;
}

export function AdditionalServicesBuilder({ 
  entries, 
  onChange, 
  inputMethod, 
  overallMargin, 
  commission,
  selectedDestinations = [],
  proposalCurrency = "USD",
  proposalStartDate = "",
  proposalEndDate = ""
}: Props) {
  const { t } = useTranslation();
  const { destinations } = useData();

  // Filter destinations based on selected ones in basic information
  const availableDestinations = destinations.filter(d => 
    d.isActive && (selectedDestinations.length === 0 || selectedDestinations.includes(d.id))
  );

  const addEntry = () => {
    onChange([
      ...entries,
      {
        id: Date.now(),
        destinationId: "",
        date: "",
        description: "",
        serviceType: "",
        numDays: 1,
        numPeople: 1,
        currency: proposalCurrency,
        pricePerDay: "",
        totalPrice: 0,
      },
    ]);
  };

  const updateEntry = (index: number, field: string, value: any) => {
    const updated = [...entries];
    (updated[index] as any)[field] = value;
    onChange(updated);
  };

  const removeEntry = (index: number) => {
    onChange(entries.filter((_, i) => i !== index));
  };

  const duplicateEntry = (index: number) => {
    const entry = { ...entries[index], id: Date.now() };
    onChange([...entries, entry]);
  };

  const calculateTotal = (entry: AdditionalServiceEntry) => {
    return (parseFloat(entry.pricePerDay) || 0) * entry.numDays * entry.numPeople;
  };

  if (inputMethod === "forms") {
    return (
      <>
        {entries.map((entry, index) => (
          <div
            key={entry.id}
            className="p-4 border rounded-lg space-y-4 bg-purple-50 border-purple-200"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Package className="h-4 w-4 text-purple-600" />
                {t('builders.serviceEntry', { number: index + 1 })}
              </h4>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => duplicateEntry(index)}
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-100"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                {entries.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEntry(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>{t('builders.destinationRequired')}</Label>
                <Select
                  value={entry.destinationId}
                  onValueChange={(val) => updateEntry(index, "destinationId", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('builders.selectDestination')} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDestinations.map(destination => (
                      <SelectItem key={destination.id} value={destination.id}>{destination.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('builders.dateRequired')}</Label>
                <Input
                  type="date"
                  value={entry.date}
                  onChange={(e) => updateEntry(index, "date", e.target.value)}
                  min={proposalStartDate}
                  max={proposalEndDate}
                />
              </div>

              <div className="space-y-2">
                <Label>{t('builders.serviceTypeRequired')}</Label>
                <Select
                  value={entry.serviceType}
                  onValueChange={(val) => updateEntry(index, "serviceType", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('builders.selectServiceType')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Guide">Tour Guide</SelectItem>
                    <SelectItem value="Museum">Museum Entry</SelectItem>
                    <SelectItem value="Activity">Activity</SelectItem>
                    <SelectItem value="Excursion">Excursion</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-3">
                <Label>{t('builders.description')}</Label>
                <Input
                  placeholder={t('builders.descriptionPlaceholder')}
                  value={entry.description}
                  onChange={(e) => updateEntry(index, "description", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>{t('builders.numberOfDaysRequired')}</Label>
                <Input
                  type="number"
                  min="1"
                  value={entry.numDays}
                  onChange={(e) =>
                    updateEntry(index, "numDays", parseInt(e.target.value) || 1)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>{t('builders.numberOfPeopleRequired')}</Label>
                <Input
                  type="number"
                  min="1"
                  value={entry.numPeople}
                  onChange={(e) =>
                    updateEntry(index, "numPeople", parseInt(e.target.value) || 1)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>{t('builders.currency')}</Label>
                <Input
                  value={proposalCurrency}
                  disabled
                  className="bg-gray-100 font-semibold text-gray-700"
                />
              </div>

              <div className="space-y-2">
                <Label>{t('builders.pricePerDayRequired')}</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={entry.pricePerDay}
                  onChange={(e) => updateEntry(index, "pricePerDay", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>{t('builders.totalPrice')}</Label>
                <Input
                  value={`${proposalCurrency} ${(calculateTotal(entry) || 0).toFixed(2)}`}
                  disabled
                  className="bg-white font-semibold"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-purple-700">{t('builders.priceAfterMarginCommission', { percent: (parseFloat(overallMargin) || 0) + (parseFloat(commission) || 0) })}</Label>
                <Input
                  value={`${proposalCurrency} ${((calculateTotal(entry) || 0) * (1 + ((parseFloat(overallMargin) || 0) + (parseFloat(commission) || 0)) / 100)).toFixed(2)}`}
                  disabled
                  className="bg-purple-50 font-bold text-purple-700 border-purple-300"
                />
              </div>
            </div>
          </div>
        ))}
        <Button onClick={addEntry} variant="outline" className="w-full gap-2">
          <Plus className="h-4 w-4" />
          {t('builders.addService')}
        </Button>
      </>
    );
  }

  // Table View
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-purple-50 border-b">
            <tr>
              <th className="p-2 text-left">{t('builders.tableHeaderNumber')}</th>
              <th className="p-2 text-left min-w-[120px]">{t('builders.tableHeaderDestination')}</th>
              <th className="p-2 text-left min-w-[120px]">{t('builders.tableHeaderDate')}</th>
              <th className="p-2 text-left min-w-[120px]">{t('builders.tableHeaderServiceType')}</th>
              <th className="p-2 text-left min-w-[150px]">{t('builders.tableHeaderDescription')}</th>
              <th className="p-2 text-left">{t('builders.tableHeaderDays')}</th>
              <th className="p-2 text-left">{t('builders.tableHeaderPeople')}</th>
              <th className="p-2 text-left">{t('builders.tableHeaderCur')}</th>
              <th className="p-2 text-left min-w-[100px]">{t('builders.tableHeaderPriceDay')}</th>
              <th className="p-2 text-left min-w-[100px]">{t('builders.tableHeaderTotal')}</th>
              <th className="p-2 text-left">{t('builders.tableHeaderActions')}</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={entry.id} className="border-b hover:bg-purple-50">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">
                  <Select
                    value={entry.destinationId}
                    onValueChange={(val) => updateEntry(index, "destinationId", val)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDestinations.map(destination => (
                        <SelectItem key={destination.id} value={destination.id}>{destination.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-2">
                  <Input
                    type="date"
                    className="h-8 text-xs"
                    value={entry.date}
                    onChange={(e) => updateEntry(index, "date", e.target.value)}
                    min={proposalStartDate}
                    max={proposalEndDate}
                  />
                </td>
                <td className="p-2">
                  <Select
                    value={entry.serviceType}
                    onValueChange={(val) => updateEntry(index, "serviceType", val)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Guide">Tour Guide</SelectItem>
                      <SelectItem value="Activity">Activity</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-2">
                  <Input
                    className="h-8 text-xs"
                    value={entry.description}
                    onChange={(e) => updateEntry(index, "description", e.target.value)}
                  />
                </td>
                <td className="p-2">
                  <Input
                    type="number"
                    className="h-8 text-xs w-16"
                    value={entry.numDays}
                    onChange={(e) =>
                      updateEntry(index, "numDays", parseInt(e.target.value) || 1)
                    }
                  />
                </td>
                <td className="p-2">
                  <Input
                    type="number"
                    className="h-8 text-xs w-16"
                    value={entry.numPeople}
                    onChange={(e) =>
                      updateEntry(index, "numPeople", parseInt(e.target.value) || 1)
                    }
                  />
                </td>
                <td className="p-2">
                  <Select
                    value={entry.currency}
                    onValueChange={(val) => updateEntry(index, "currency", val)}
                  >
                    <SelectTrigger className="h-8 text-xs w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-2">
                  <Input
                    value={proposalCurrency}
                    disabled
                    className="h-8 text-xs w-20 bg-gray-100 font-semibold text-gray-700"
                  />
                </td>
                <td className="p-2">
                  <Input
                    type="number"
                    step="0.01"
                    className="h-8 text-xs"
                    value={entry.pricePerDay}
                    onChange={(e) => updateEntry(index, "pricePerDay", e.target.value)}
                  />
                </td>
                <td className="p-2 font-semibold text-purple-600">
                  {calculateTotal(entry).toFixed(2)}
                </td>
                <td className="p-2">
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => duplicateEntry(index)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    {entries.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-600"
                        onClick={() => removeEntry(index)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button onClick={addEntry} variant="outline" className="gap-2">
        <Plus className="h-4 w-4" />
        {t('builders.addRow')}
      </Button>
    </div>
  );
}