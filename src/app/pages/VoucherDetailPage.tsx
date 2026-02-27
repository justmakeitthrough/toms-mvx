import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
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
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { ArrowLeft, Plus, Trash2, Mail, FileDown, Save, LayoutGrid, LayoutList, Copy } from "lucide-react";
import { toast } from "sonner";
import { useData, type VoucherStatus, type Guest } from "../contexts/DataContext";
import { generateVoucherPDF } from "../utils/pdfGenerator";

export function VoucherDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getVoucher, updateVoucher, getHotel, getDestination, getAgency, getUser, getSource, companyInfo } = useData();
  const { t } = useTranslation();

  const voucherData = id ? getVoucher(id) : null;

  const [voucher, setVoucher] = useState(voucherData);
  const [guests, setGuests] = useState<Guest[]>(voucherData?.guests || []);
  const [guestViewMode, setGuestViewMode] = useState<"cards" | "table">("cards");
  const [pdfLanguage, setPdfLanguage] = useState("english");

  useEffect(() => {
    if (voucherData) {
      setVoucher(voucherData);
      setGuests(voucherData.guests || []);
    }
  }, [voucherData]);

  if (!voucher) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/vouchers")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('vouchers.detail.notFound')}</h1>
          </div>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">{t('vouchers.detail.notFoundMessage')}</p>
            <Button onClick={() => navigate("/vouchers")} className="mt-4">
              {t('vouchers.detail.backToVouchers')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const agency = getAgency(voucher.agencyId);
  const salesPerson = getUser(voucher.salesPersonId);

  const addGuest = () => {
    const newGuest: Guest = {
      id: Date.now(),
      firstName: "",
      lastName: "",
      passportNumber: "",
      nationality: "",
      birthDate: "",
    };
    setGuests([...guests, newGuest]);
  };

  const removeGuest = (id: number) => {
    setGuests(guests.filter((g) => g.id !== id));
  };

  const duplicateGuest = (id: number) => {
    const guestToDuplicate = guests.find((g) => g.id === id);
    if (guestToDuplicate) {
      const newGuest: Guest = {
        ...guestToDuplicate,
        id: Date.now() + Math.random(),
      };
      setGuests([...guests, newGuest]);
      toast.success(t('vouchers.detail.toasts.guestDuplicated'));
    }
  };

  const updateGuest = (id: number, field: keyof Guest, value: string) => {
    setGuests(guests.map((g) => (g.id === id ? { ...g, [field]: value } : g)));
  };

  const handleSave = () => {
    if (id) {
      updateVoucher(id, {
        ...voucher,
        guests,
      });
      toast.success(t('vouchers.detail.toasts.voucherUpdated'));
    }
  };

  const handleEmail = () => {
    toast.success(t('vouchers.detail.toasts.voucherEmailed'));
  };

  const handleGeneratePDF = () => {
    const agency = getAgency(voucher.agencyId);
    const salesPerson = getUser(voucher.salesPersonId);
    
    // Create updated voucher with current guests
    const updatedVoucher = {
      ...voucher,
      guests: guests,
    };
    
    generateVoucherPDF(
      updatedVoucher,
      agency,
      salesPerson,
      companyInfo,
      pdfLanguage
    );
    toast.success(t('vouchers.detail.toasts.pdfGenerated'));
  };

  const handleStatusChange = (newStatus: VoucherStatus) => {
    setVoucher({ ...voucher, status: newStatus });
    if (id) {
      updateVoucher(id, { status: newStatus });
      toast.success(`${t('vouchers.detail.toasts.statusUpdated')} ${t(`vouchers.statuses.${newStatus}`)}`);
    }
  };

  const getStatusBadge = (status: VoucherStatus) => {
    switch (status) {
      case "PENDING_PAYMENT":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            {t('vouchers.statuses.PENDING_PAYMENT')}
          </Badge>
        );
      case "PAID":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {t('vouchers.statuses.PAID')}
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {t('vouchers.statuses.COMPLETED')}
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            {t('vouchers.statuses.CANCELLED')}
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getServiceTypeName = () => {
    switch (voucher.serviceType) {
      case "hotel":
        return t('vouchers.detail.serviceTypes.hotel');
      case "transportation":
        return t('vouchers.detail.serviceTypes.transportation');
      case "flight":
        return t('vouchers.detail.serviceTypes.flight');
      case "rentacar":
        return t('vouchers.detail.serviceTypes.rentacar');
      case "additional":
        return t('vouchers.detail.serviceTypes.additional');
      default:
        return voucher.serviceType;
    }
  };

  const renderServiceDetails = () => {
    const data = voucher.serviceData;

    if (voucher.serviceType === "hotel") {
      const hotel = getHotel(data.hotelId);
      const destination = getDestination(data.destinationId);
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-gray-600">{t('vouchers.detail.destination')}</Label>
              <p className="font-semibold">{destination?.name || t('vouchers.detail.unknown')}</p>
            </div>
            <div>
              <Label className="text-gray-600">{t('vouchers.detail.hotel')}</Label>
              <p className="font-semibold">{hotel?.name || t('vouchers.detail.unknownHotel')}</p>
            </div>
            <div>
              <Label className="text-gray-600">{t('vouchers.detail.checkin')}</Label>
              <p className="font-semibold">{data.checkin}</p>
            </div>
            <div>
              <Label className="text-gray-600">{t('vouchers.detail.checkout')}</Label>
              <p className="font-semibold">{data.checkout}</p>
            </div>
            <div>
              <Label className="text-gray-600">{t('vouchers.detail.nights')}</Label>
              <p className="font-semibold">{data.nights}</p>
            </div>
            <div>
              <Label className="text-gray-600">{t('vouchers.detail.rooms')}</Label>
              <p className="font-semibold">
                {data.numRooms}x {data.roomType}
              </p>
            </div>
            <div>
              <Label className="text-gray-600">{t('vouchers.detail.boardType')}</Label>
              <p className="font-semibold">{data.boardType}</p>
            </div>
            <div>
              <Label className="text-gray-600">{t('vouchers.detail.totalPrice')}</Label>
              <p className="font-semibold text-green-600">
                {data.currency} {data.totalPrice.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (voucher.serviceType === "transportation") {
      const destination = getDestination(data.destinationId);
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-gray-600">{t('vouchers.detail.destination')}</Label>
              <p className="font-semibold">{destination?.name || t('vouchers.detail.unknown')}</p>
            </div>
            <div>
              <Label className="text-gray-600">{t('vouchers.detail.date')}</Label>
              <p className="font-semibold">{data.date}</p>
            </div>
            <div>
              <Label className="text-gray-600">{t('vouchers.detail.vehicleType')}</Label>
              <p className="font-semibold">{data.vehicleType}</p>
            </div>
            <div>
              <Label className="text-gray-600">{t('vouchers.detail.description')}</Label>
              <p className="font-semibold">{data.description}</p>
            </div>
            <div>
              <Label className="text-gray-600">{t('vouchers.detail.days')}</Label>
              <p className="font-semibold">{data.numDays}</p>
            </div>
            <div>
              <Label className="text-gray-600">{t('vouchers.detail.vehicles')}</Label>
              <p className="font-semibold">{data.numVehicles}</p>
            </div>
            <div className="col-span-2">
              <Label className="text-gray-600">{t('vouchers.detail.totalPrice')}</Label>
              <p className="font-semibold text-green-600">
                {data.currency} {data.totalPrice.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (voucher.serviceType === "flight") {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-gray-600">{t('vouchers.detail.date')}</Label>
              <p className="font-semibold">{data.date}</p>
            </div>
            <div>
              <Label className="text-gray-600">{t('vouchers.detail.departure')}</Label>
              <p className="font-semibold">{data.departure}</p>
            </div>
            <div>
              <Label className="text-gray-600">{t('vouchers.detail.arrival')}</Label>
              <p className="font-semibold">{data.arrival}</p>
            </div>
            <div>
              <Label className="text-gray-600">{t('vouchers.detail.flightType')}</Label>
              <p className="font-semibold">{data.flightType}</p>
            </div>
            <div>
              <Label className="text-gray-600">{t('vouchers.detail.airline')}</Label>
              <p className="font-semibold">{data.airline}</p>
            </div>
            <div>
              <Label className="text-gray-600">{t('vouchers.detail.departureTime')}</Label>
              <p className="font-semibold">{data.departureTime}</p>
            </div>
            <div>
              <Label className="text-gray-600">{t('vouchers.detail.arrivalTime')}</Label>
              <p className="font-semibold">{data.arrivalTime}</p>
            </div>
            <div>
              <Label className="text-gray-600">{t('vouchers.detail.passengers')}</Label>
              <p className="font-semibold">{data.pax} {t('vouchers.pax')}</p>
            </div>
            <div className="col-span-2">
              <Label className="text-gray-600">{t('vouchers.detail.totalPrice')}</Label>
              <p className="font-semibold text-green-600">
                {data.currency} {data.totalPrice.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (voucher.serviceType === "rentacar") {
      const destination = getDestination(data.destinationId);
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-gray-600">{t('vouchers.detail.destination')}</Label>
              <p className="font-semibold">{destination?.name || t('vouchers.detail.unknown')}</p>
            </div>
            <div>
              <Label className="text-gray-600">{t('vouchers.detail.carType')}</Label>
              <p className="font-semibold">{data.carType}</p>
            </div>
            <div>
              <Label className="text-gray-600">{t('vouchers.detail.pickupDate')}</Label>
              <p className="font-semibold">{data.pickupDate}</p>
            </div>
            <div>
              <Label className="text-gray-600">{t('vouchers.detail.dropoffDate')}</Label>
              <p className="font-semibold">{data.dropoffDate}</p>
            </div>
            <div className="col-span-2">
              <Label className="text-gray-600">{t('vouchers.detail.pickupLocation')}</Label>
              <p className="font-semibold">{data.pickupLocation}</p>
            </div>
            <div className="col-span-2">
              <Label className="text-gray-600">{t('vouchers.detail.dropoffLocation')}</Label>
              <p className="font-semibold">{data.dropoffLocation}</p>
            </div>
            <div>
              <Label className="text-gray-600">{t('vouchers.detail.days')}</Label>
              <p className="font-semibold">{data.numDays}</p>
            </div>
            <div>
              <Label className="text-gray-600">{t('vouchers.detail.cars')}</Label>
              <p className="font-semibold">{data.numCars}</p>
            </div>
            <div className="col-span-2">
              <Label className="text-gray-600">{t('vouchers.detail.totalPrice')}</Label>
              <p className="font-semibold text-green-600">
                {data.currency} {data.totalPrice.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (voucher.serviceType === "additional") {
      const destination = getDestination(data.destinationId);
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-gray-600">{t('vouchers.detail.destination')}</Label>
              <p className="font-semibold">{destination?.name || t('vouchers.detail.unknown')}</p>
            </div>
            <div>
              <Label className="text-gray-600">{t('vouchers.detail.date')}</Label>
              <p className="font-semibold">{data.date}</p>
            </div>
            <div>
              <Label className="text-gray-600">{t('vouchers.serviceType')}</Label>
              <p className="font-semibold">{data.serviceType}</p>
            </div>
            <div>
              <Label className="text-gray-600">{t('vouchers.detail.description')}</Label>
              <p className="font-semibold">{data.description}</p>
            </div>
            <div>
              <Label className="text-gray-600">{t('vouchers.detail.days')}</Label>
              <p className="font-semibold">{data.numDays}</p>
            </div>
            <div>
              <Label className="text-gray-600">{t('vouchers.detail.passengers')}</Label>
              <p className="font-semibold">{data.numPax} {t('vouchers.pax')}</p>
            </div>
            <div className="col-span-2">
              <Label className="text-gray-600">{t('vouchers.detail.totalPrice')}</Label>
              <p className="font-semibold text-green-600">
                {data.currency} {data.totalPrice.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/vouchers")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">{voucher.id}</h1>
              {getStatusBadge(voucher.status)}
            </div>
            <p className="text-gray-600 mt-1">
              {getServiceTypeName()} {t('vouchers.detail.voucher')} - {t('vouchers.detail.proposal')} {voucher.proposalReference}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            {t('vouchers.detail.save')}
          </Button>
          <Button variant="outline" onClick={handleEmail} className="gap-2">
            <Mail className="h-4 w-4" />
            {t('vouchers.detail.emailVoucher')}
          </Button>
          <Button onClick={handleGeneratePDF} className="gap-2">
            <FileDown className="h-4 w-4" />
            {t('vouchers.detail.generatePDF')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Voucher Details */}
          <Card>
            <CardHeader>
              <CardTitle>{t('vouchers.detail.voucherInformation')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600">{t('vouchers.detail.source')}</Label>
                  <p className="font-semibold capitalize">{getSource(voucher.source)?.name || voucher.source}</p>
                </div>
                <div>
                  <Label className="text-gray-600">{t('vouchers.detail.agency')}</Label>
                  <p className="font-semibold">{agency?.name || t('vouchers.detail.unknownAgency')}</p>
                </div>
                <div>
                  <Label className="text-gray-600">{t('vouchers.detail.salesPerson')}</Label>
                  <p className="font-semibold">{salesPerson?.name || t('vouchers.detail.unknown')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Details */}
          <Card>
            <CardHeader>
              <CardTitle>{getServiceTypeName()} {t('vouchers.detail.details')}</CardTitle>
            </CardHeader>
            <CardContent>{renderServiceDetails()}</CardContent>
          </Card>

          {/* Guests Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t('vouchers.detail.guestsInformation')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="adults">{t('vouchers.detail.adults')}</Label>
                  <Input
                    id="adults"
                    type="number"
                    value={voucher.adults}
                    onChange={(e) => setVoucher({ ...voucher, adults: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="children">{t('vouchers.detail.children')}</Label>
                  <Input
                    id="children"
                    type="number"
                    value={voucher.children}
                    onChange={(e) => setVoucher({ ...voucher, children: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('vouchers.detail.totalPax')}</Label>
                  <div className="h-10 flex items-center px-3 bg-gray-50 rounded-md border">
                    <span className="font-semibold">{voucher.adults + voucher.children}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Guest Names */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t('vouchers.detail.guestDetails')}</CardTitle>
                <div className="flex items-center gap-2">
                  <RadioGroup
                    value={guestViewMode}
                    onValueChange={(val: any) => setGuestViewMode(val)}
                    className="flex items-center gap-1"
                  >
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="cards" id="cards-view" className="sr-only" />
                      <Label
                        htmlFor="cards-view"
                        className={`cursor-pointer p-2 rounded-md transition-colors ${
                          guestViewMode === "cards"
                            ? "bg-blue-100 text-blue-900"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <LayoutGrid className="h-4 w-4" />
                      </Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <RadioGroupItem value="table" id="table-view" className="sr-only" />
                      <Label
                        htmlFor="table-view"
                        className={`cursor-pointer p-2 rounded-md transition-colors ${
                          guestViewMode === "table"
                            ? "bg-blue-100 text-blue-900"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <LayoutList className="h-4 w-4" />
                      </Label>
                    </div>
                  </RadioGroup>
                  <Button onClick={addGuest} variant="outline" size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    {t('vouchers.detail.addGuest')}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {guestViewMode === "cards" && (
                <>
                  {guests.map((guest, index) => (
                    <div key={guest.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">{t('vouchers.detail.firstName')}</Label>
                          <Input
                            placeholder={t('vouchers.detail.firstName')}
                            value={guest.firstName}
                            onChange={(e) => updateGuest(guest.id, "firstName", e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">{t('vouchers.detail.lastName')}</Label>
                          <Input
                            placeholder={t('vouchers.detail.lastName')}
                            value={guest.lastName}
                            onChange={(e) => updateGuest(guest.id, "lastName", e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">{t('vouchers.detail.birthDate')}</Label>
                          <Input
                            type="date"
                            placeholder={t('vouchers.detail.birthDate')}
                            value={guest.birthDate}
                            onChange={(e) => updateGuest(guest.id, "birthDate", e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">{t('vouchers.detail.passportNumber')}</Label>
                          <Input
                            placeholder={t('vouchers.detail.passportNumber')}
                            value={guest.passportNumber}
                            onChange={(e) => updateGuest(guest.id, "passportNumber", e.target.value)}
                          />
                        </div>
                        <div className="space-y-1 col-span-2">
                          <Label className="text-xs">{t('vouchers.detail.nationality')}</Label>
                          <Input
                            placeholder={t('vouchers.detail.nationality')}
                            value={guest.nationality}
                            onChange={(e) => updateGuest(guest.id, "nationality", e.target.value)}
                          />
                        </div>
                      </div>
                      {guests.length > 0 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeGuest(guest.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 mt-6"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </>
              )}
              {guestViewMode === "table" && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('vouchers.detail.firstName')}</TableHead>
                      <TableHead>{t('vouchers.detail.lastName')}</TableHead>
                      <TableHead>{t('vouchers.detail.birthDate')}</TableHead>
                      <TableHead>{t('vouchers.detail.passportNumber')}</TableHead>
                      <TableHead>{t('vouchers.detail.nationality')}</TableHead>
                      <TableHead className="text-right">{t('vouchers.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {guests.map((guest) => (
                      <TableRow key={guest.id}>
                        <TableCell>
                          <Input
                            placeholder={t('vouchers.detail.firstName')}
                            value={guest.firstName}
                            onChange={(e) => updateGuest(guest.id, "firstName", e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            placeholder={t('vouchers.detail.lastName')}
                            value={guest.lastName}
                            onChange={(e) => updateGuest(guest.id, "lastName", e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="date"
                            placeholder={t('vouchers.detail.birthDate')}
                            value={guest.birthDate}
                            onChange={(e) => updateGuest(guest.id, "birthDate", e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            placeholder={t('vouchers.detail.passportNumber')}
                            value={guest.passportNumber}
                            onChange={(e) => updateGuest(guest.id, "passportNumber", e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            placeholder={t('vouchers.detail.nationality')}
                            value={guest.nationality}
                            onChange={(e) => updateGuest(guest.id, "nationality", e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => duplicateGuest(guest.id)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              title={t('vouchers.detail.copyGuest')}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeGuest(guest.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              title={t('vouchers.detail.deleteGuest')}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>{t('vouchers.detail.notes')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder={t('vouchers.detail.notesPlaceholder')}
                rows={4}
                value={voucher.notes}
                onChange={(e) => setVoucher({ ...voucher, notes: e.target.value })}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Management */}
          <Card>
            <CardHeader>
              <CardTitle>{t('vouchers.detail.statusManagement')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label>{t('vouchers.detail.currentStatus')}</Label>
                <Select value={voucher.status} onValueChange={(value) => handleStatusChange(value as VoucherStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING_PAYMENT">{t('vouchers.statuses.PENDING_PAYMENT')}</SelectItem>
                    <SelectItem value="PAID">{t('vouchers.statuses.PAID')}</SelectItem>
                    <SelectItem value="COMPLETED">{t('vouchers.statuses.COMPLETED')}</SelectItem>
                    <SelectItem value="CANCELLED">{t('vouchers.statuses.CANCELLED')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-900">
                <p className="font-semibold mb-1">{t('vouchers.detail.statusFlow')}</p>
                <p className="text-xs">
                  {t('vouchers.detail.statusFlowText')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Financial Info */}
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">{t('vouchers.detail.internalInformation')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">{t('vouchers.detail.totalPrice')}</span>
                <span className="font-semibold text-green-600">
                  {voucher.serviceData.currency} {voucher.serviceData.totalPrice.toFixed(2)}
                </span>
              </div>
              {voucher.serviceData.marginType && (
                <div className="pt-3 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t('vouchers.detail.marginType')}</span>
                    <span className="font-semibold capitalize">{voucher.serviceData.marginType}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-600">{t('vouchers.detail.marginValue')}</span>
                    <span className="font-semibold">
                      {voucher.serviceData.marginType === "percentage"
                        ? `${voucher.serviceData.margin}%`
                        : `${voucher.serviceData.currency} ${voucher.serviceData.margin}`}
                    </span>
                  </div>
                </div>
              )}
              <p className="text-xs text-gray-500 pt-2">{t('vouchers.detail.notIncludedInPDF')}</p>
            </CardContent>
          </Card>

          {/* PDF Language */}
          <Card>
            <CardHeader>
              <CardTitle>{t('vouchers.detail.pdfLanguage')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Select value={pdfLanguage} onValueChange={(value) => setPdfLanguage(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">{t('vouchers.detail.english')}</SelectItem>
                  <SelectItem value="arabic">{t('vouchers.detail.arabic')}</SelectItem>
                  <SelectItem value="turkish">{t('vouchers.detail.turkish')}</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">{t('vouchers.detail.selectPdfLanguage')}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}