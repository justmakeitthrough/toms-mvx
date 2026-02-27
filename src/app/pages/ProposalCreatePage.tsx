import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Combobox } from "../components/ui/combobox";
import { MultiSelect } from "../components/ui/multi-select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { 
  ArrowLeft, Plus, Trash2, FileText, Hotel, Plane, 
  Car, Bus, Package, Copy, FileStack 
} from "lucide-react";
import { toast } from "sonner";
import { useData, type Proposal } from "../contexts/DataContext";
import { useAuth } from "../contexts/AuthContext";
import { TransportationBuilder } from "../components/proposal/TransportationBuilder";
import { FlightsBuilder } from "../components/proposal/FlightsBuilder";
import { RentACarBuilder } from "../components/proposal/RentACarBuilder";
import { AdditionalServicesBuilder } from "../components/proposal/AdditionalServicesBuilder";
import { HotelsBuilder } from "../components/proposal/HotelsBuilder";
import { useTranslation } from "react-i18next";

type ServiceType = "hotels" | "transportation" | "flights" | "rentacar" | "additional";

export function ProposalCreatePage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const { addProposal, updateProposal, getProposal, destinations, agencies, users, proposals, sources } = useData();
  const { user } = useAuth();
  
  const [inputMethod, setInputMethod] = useState<"forms" | "table">("forms");
  const [activeTab, setActiveTab] = useState("basic");
  const [activeServiceTab, setActiveServiceTab] = useState<ServiceType>("hotels");

  // Modal state for choosing creation method
  const [showCreationModal, setShowCreationModal] = useState(!editId);
  const [selectedProposalToCopy, setSelectedProposalToCopy] = useState("");

  // Load existing proposal if editing
  const existingProposal = editId ? getProposal(editId) : null;

  // Helper function to map i18n language to PDF language
  const mapLanguageToPdfLanguage = (lang: string): string => {
    const langMap: Record<string, string> = {
      'en': 'english',
      'ar': 'arabic',
      'tr': 'turkish',
      'de': 'english', // Default to English for German
    };
    return langMap[lang] || 'english';
  };

  // Basic Info
  const [proposalId] = useState(editId || `${Date.now()}`);
  const [reference] = useState(
    existingProposal?.reference || `TOMS-2024-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [source, setSource] = useState(existingProposal?.source || "");
  const [agency, setAgency] = useState(existingProposal?.agencyId || "");
  const [salesPerson, setSalesPerson] = useState(existingProposal?.salesPersonId || user?.id || "");
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(
    existingProposal?.destinationIds || []
  );
  const [estimatedNights, setEstimatedNights] = useState(existingProposal?.estimatedNights || "");
  const [proposalCurrency, setProposalCurrency] = useState(existingProposal?.proposalCurrency || "USD");
  const [proposalStartDate, setProposalStartDate] = useState(existingProposal?.proposalStartDate || "");
  const [proposalEndDate, setProposalEndDate] = useState(existingProposal?.proposalEndDate || "");

  // Services
  const [hotels, setHotels] = useState(existingProposal?.hotels || [
    {
      id: Date.now(),
      destinationId: "",
      hotelId: "",
      checkin: "",
      checkout: "",
      nights: 0,
      roomType: "",
      boardType: "",
      numRooms: 1,
      currency: "USD",
      pricePerNight: "",
      totalPrice: 0,
    },
  ]);

  const [transportation, setTransportation] = useState(existingProposal?.transportation || [
    {
      id: Date.now(),
      destinationId: "", date: "", description: "", vehicleType: "", numDays: 1, numVehicles: 1,
      currency: "USD", pricePerDay: "", totalPrice: 0,
    },
  ]);

  const [flights, setFlights] = useState(existingProposal?.flights || [
    {
      id: Date.now(),
      destinationId: "", date: "", departure: "", arrival: "", departureTime: "", arrivalTime: "",
      flightType: "", pax: 1, currency: "USD", pricePerPax: "", totalPrice: 0,
    },
  ]);

  const [rentACar, setRentACar] = useState(existingProposal?.rentACar || [
    {
      id: Date.now(),
      destinationId: "", date: "", carType: "", pickupLocation: "", dropoffLocation: "",
      numDays: 1, currency: "USD",
      pricePerDay: "", totalPrice: 0,
    },
  ]);

  const [additionalServices, setAdditionalServices] = useState(existingProposal?.additionalServices || [
    {
      id: Date.now(),
      destinationId: "", date: "", description: "", serviceType: "", numDays: 1, numPeople: 1,
      currency: "USD",
      pricePerDay: "", totalPrice: 0,
    },
  ]);

  const [overallMargin, setOverallMargin] = useState(existingProposal?.overallMargin || "15");
  const [commission, setCommission] = useState(existingProposal?.commission || "5");
  const [pdfLanguage, setPdfLanguage] = useState(existingProposal?.pdfLanguage || mapLanguageToPdfLanguage(i18n.language));
  const [displayCurrency, setDisplayCurrency] = useState(existingProposal?.displayCurrency || proposalCurrency.toLowerCase());

  // Update PDF language when system language changes (only if not editing existing proposal)
  useEffect(() => {
    if (!existingProposal) {
      setPdfLanguage(mapLanguageToPdfLanguage(i18n.language));
    }
  }, [i18n.language, existingProposal]);

  // Update display currency when proposal currency changes (only if not editing existing proposal)
  useEffect(() => {
    if (!existingProposal) {
      setDisplayCurrency(proposalCurrency.toLowerCase());
    }
  }, [proposalCurrency, existingProposal]);

  // Validation function for Basic Information
  const validateBasicInfo = (): boolean => {
    const errors: string[] = [];

    if (!salesPerson) {
      errors.push(t('proposalCreate.validation.salesPersonRequired'));
    }
    if (!source) {
      errors.push(t('proposalCreate.validation.sourceRequired'));
    }
    if (selectedDestinations.length === 0) {
      errors.push(t('proposalCreate.validation.destinationsRequired'));
    }
    if (!proposalCurrency) {
      errors.push(t('proposalCreate.validation.currencyRequired'));
    }

    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return false;
    }

    return true;
  };

  // Validation function for Hotel entries
  const validateHotelEntry = (hotel: any, index: number): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    // Only check fields that user would actually fill - ignore default values like numRooms
    const hasAnyData = hotel.destinationId || hotel.hotelId || hotel.checkin || 
                       hotel.checkout || hotel.roomType || hotel.boardType || hotel.pricePerNight;

    if (!hasAnyData) return { isValid: true, errors: [] }; // Empty entry is ok

    if (!hotel.destinationId) errors.push(t('proposalCreate.validation.hotelDestinationRequired', { index: index + 1 }));
    if (!hotel.hotelId) errors.push(t('proposalCreate.validation.hotelNameRequired', { index: index + 1 }));
    if (!hotel.checkin) errors.push(t('proposalCreate.validation.hotelCheckinRequired', { index: index + 1 }));
    if (!hotel.checkout) errors.push(t('proposalCreate.validation.hotelCheckoutRequired', { index: index + 1 }));
    if (!hotel.roomType) errors.push(t('proposalCreate.validation.hotelRoomTypeRequired', { index: index + 1 }));
    if (!hotel.boardType) errors.push(t('proposalCreate.validation.hotelBoardTypeRequired', { index: index + 1 }));
    // Price is optional - not all hotels may have confirmed pricing yet

    return { isValid: errors.length === 0, errors };
  };

  // Validation function for Transportation entries
  const validateTransportationEntry = (transport: any, index: number): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    // Only check fields that user would actually fill - ignore default values like numDays
    const hasAnyData = transport.destinationId || transport.date || transport.vehicleType || 
                       transport.description || transport.pricePerDay;

    if (!hasAnyData) return { isValid: true, errors: [] };

    if (!transport.destinationId) errors.push(t('proposalCreate.validation.transportDestinationRequired', { index: index + 1 }));
    if (!transport.date) errors.push(t('proposalCreate.validation.transportDateRequired', { index: index + 1 }));
    if (!transport.vehicleType) errors.push(t('proposalCreate.validation.transportVehicleRequired', { index: index + 1 }));
    // Price is optional - not all services may have confirmed pricing yet

    return { isValid: errors.length === 0, errors };
  };

  // Validation function for Flight entries
  const validateFlightEntry = (flight: any, index: number): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    // Only check fields that user would actually fill - ignore default values like numPassengers
    const hasAnyData = flight.flightType || flight.departureCity || flight.arrivalCity || 
                       flight.date || flight.pricePerPassenger;

    if (!hasAnyData) return { isValid: true, errors: [] };

    if (!flight.flightType) errors.push(t('proposalCreate.validation.flightTypeRequired', { index: index + 1 }));
    if (!flight.departureCity) errors.push(t('proposalCreate.validation.flightDepartureRequired', { index: index + 1 }));
    if (!flight.arrivalCity) errors.push(t('proposalCreate.validation.flightArrivalRequired', { index: index + 1 }));
    if (!flight.date) errors.push(t('proposalCreate.validation.flightDateRequired', { index: index + 1 }));
    // Price is optional - not all flights may have confirmed pricing yet

    return { isValid: errors.length === 0, errors };
  };

  // Validation function for Rent-a-Car entries
  const validateRentACarEntry = (car: any, index: number): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    // Only check fields that user would actually fill - ignore default values like numCars
    const hasAnyData = car.destinationId || car.carType || car.pickupLocation || 
                       car.dropoffLocation || car.pickupDate || car.dropoffDate || car.pricePerDay;

    if (!hasAnyData) return { isValid: true, errors: [] };

    if (!car.destinationId) errors.push(t('proposalCreate.validation.carDestinationRequired', { index: index + 1 }));
    if (!car.carType) errors.push(t('proposalCreate.validation.carTypeRequired', { index: index + 1 }));
    if (!car.pickupLocation) errors.push(t('proposalCreate.validation.carPickupRequired', { index: index + 1 }));
    if (!car.dropoffLocation) errors.push(t('proposalCreate.validation.carDropoffRequired', { index: index + 1 }));
    if (!car.pickupDate) errors.push(t('proposalCreate.validation.carPickupDateRequired', { index: index + 1 }));
    if (!car.dropoffDate) errors.push(t('proposalCreate.validation.carDropoffDateRequired', { index: index + 1 }));
    // Price is optional - not all car rentals may have confirmed pricing yet

    return { isValid: errors.length === 0, errors };
  };

  // Validation function for Additional Services entries
  const validateAdditionalServiceEntry = (service: any, index: number): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    // Only check fields that user would actually fill - ignore default values like numDays
    const hasAnyData = service.destinationId || service.date || service.description || 
                       service.serviceType || service.pricePerDay;

    if (!hasAnyData) return { isValid: true, errors: [] };

    if (!service.destinationId) errors.push(t('proposalCreate.validation.serviceDestinationRequired', { index: index + 1 }));
    if (!service.date) errors.push(t('proposalCreate.validation.serviceDateRequired', { index: index + 1 }));
    if (!service.serviceType) errors.push(t('proposalCreate.validation.serviceTypeRequired', { index: index + 1 }));
    // Price is optional - not all services may have confirmed pricing yet

    return { isValid: errors.length === 0, errors };
  };

  // Validation function for Itinerary section
  const validateItinerary = (): boolean => {
    const allErrors: string[] = [];

    // Validate all hotel entries
    hotels.forEach((hotel, index) => {
      const { isValid, errors } = validateHotelEntry(hotel, index);
      if (!isValid) allErrors.push(...errors);
    });

    // Validate all transportation entries
    transportation.forEach((transport, index) => {
      const { isValid, errors } = validateTransportationEntry(transport, index);
      if (!isValid) allErrors.push(...errors);
    });

    // Validate all flight entries
    flights.forEach((flight, index) => {
      const { isValid, errors } = validateFlightEntry(flight, index);
      if (!isValid) allErrors.push(...errors);
    });

    // Validate all rent-a-car entries
    rentACar.forEach((car, index) => {
      const { isValid, errors } = validateRentACarEntry(car, index);
      if (!isValid) allErrors.push(...errors);
    });

    // Validate all additional service entries
    additionalServices.forEach((service, index) => {
      const { isValid, errors } = validateAdditionalServiceEntry(service, index);
      if (!isValid) allErrors.push(...errors);
    });

    // If there are incomplete entries, show errors
    if (allErrors.length > 0) {
      allErrors.forEach(error => toast.error(error));
      return false;
    }

    // Check if at least one complete entry exists
    const hasCompleteHotel = hotels.some(h => validateHotelEntry(h, 0).isValid && 
      (h.destinationId || h.hotelId || h.checkin));
    const hasCompleteTransport = transportation.some(t => validateTransportationEntry(t, 0).isValid && 
      (t.destinationId || t.date || t.vehicleType));
    const hasCompleteFlight = flights.some(f => validateFlightEntry(f, 0).isValid && 
      (f.flightType || f.departureCity || f.date));
    const hasCompleteCar = rentACar.some(c => validateRentACarEntry(c, 0).isValid && 
      (c.destinationId || c.carType || c.pickupDate));
    const hasCompleteService = additionalServices.some(s => validateAdditionalServiceEntry(s, 0).isValid && 
      (s.destinationId || s.date || s.serviceType));

    if (!hasCompleteHotel && !hasCompleteTransport && !hasCompleteFlight && !hasCompleteCar && !hasCompleteService) {
      toast.error(t('proposalCreate.validation.atLeastOneItineraryRequired'));
      return false;
    }

    return true;
  };

  // Handle tab change with validation
  const handleTabChange = (newTab: string) => {
    // If trying to leave basic info tab, validate first
    if (activeTab === "basic" && newTab !== "basic") {
      if (!validateBasicInfo()) {
        return; // Prevent tab change
      }
    }

    // If trying to leave itinerary tab, validate first
    if (activeTab === "itinerary" && newTab !== "itinerary") {
      if (!validateItinerary()) {
        return; // Prevent tab change
      }
    }

    setActiveTab(newTab);
  };

  // Handle creation method selection
  const handleStartFromScratch = () => {
    setShowCreationModal(false);
    toast.success(t('proposalCreate.startFromScratchSuccess'));
  };

  const handleCopyExisting = () => {
    if (!selectedProposalToCopy) {
      toast.error(t('proposalCreate.selectProposalToCopy'));
      return;
    }

    const proposalToCopy = getProposal(selectedProposalToCopy);
    if (proposalToCopy) {
      // Copy all data from selected proposal
      setSource(proposalToCopy.source || "");
      setAgency(proposalToCopy.agencyId || "");
      setSalesPerson(proposalToCopy.salesPersonId || user?.id || "");
      setSelectedDestinations(proposalToCopy.destinationIds || []);
      setEstimatedNights(proposalToCopy.estimatedNights || "");
      setProposalCurrency(proposalToCopy.proposalCurrency || "USD");
      setProposalStartDate(proposalToCopy.proposalStartDate || "");
      setProposalEndDate(proposalToCopy.proposalEndDate || "");
      
      // Copy services with new IDs
      setHotels(proposalToCopy.hotels.map(h => ({ ...h, id: Date.now() + Math.random() })));
      setTransportation(proposalToCopy.transportation.map(t => ({ ...t, id: Date.now() + Math.random() })));
      setFlights(proposalToCopy.flights.map(f => ({ ...f, id: Date.now() + Math.random() })));
      setRentACar(proposalToCopy.rentACar.map(r => ({ ...r, id: Date.now() + Math.random() })));
      setAdditionalServices(proposalToCopy.additionalServices.map(a => ({ ...a, id: Date.now() + Math.random() })));
      
      setOverallMargin(proposalToCopy.overallMargin || "15");
      setCommission(proposalToCopy.commission || "5");
      setPdfLanguage(proposalToCopy.pdfLanguage || "arabic");
      setDisplayCurrency(proposalToCopy.displayCurrency || "usd");

      setShowCreationModal(false);
      toast.success(t('proposalCreate.copiedFrom', { reference: proposalToCopy.reference }));
    }
  };

  // Load existing proposal data when editing
  useEffect(() => {
    if (existingProposal) {
      setSource(existingProposal.source || "");
      setAgency(existingProposal.agencyId || "");
      setSalesPerson(existingProposal.salesPersonId || user?.id || "");
      setSelectedDestinations(existingProposal.destinationIds || []);
      setEstimatedNights(existingProposal.estimatedNights || "");
      setProposalCurrency(existingProposal.proposalCurrency || "USD");
      setProposalStartDate(existingProposal.proposalStartDate || "");
      setProposalEndDate(existingProposal.proposalEndDate || "");
      setHotels(existingProposal.hotels || hotels);
      setTransportation(existingProposal.transportation || transportation);
      setFlights(existingProposal.flights || flights);
      setRentACar(existingProposal.rentACar || rentACar);
      setAdditionalServices(existingProposal.additionalServices || additionalServices);
      setOverallMargin(existingProposal.overallMargin || "15");
      setCommission(existingProposal.commission || "5");
      setPdfLanguage(existingProposal.pdfLanguage || "arabic");
      setDisplayCurrency(existingProposal.displayCurrency || "usd");
    }
  }, [editId]);

  // Calculations
  const calculateNights = (checkin: string, checkout: string) => {
    if (!checkin || !checkout) return 0;
    const start = new Date(checkin);
    const end = new Date(checkout);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const getGrandTotal = () => {
    const hotelTotal = hotels.reduce((sum, h) => {
      const nights = calculateNights(h.checkin, h.checkout);
      return sum + nights * (parseFloat(h.pricePerNight) || 0) * h.numRooms;
    }, 0);
    const transportTotal = transportation.reduce((sum, t) => 
      sum + (parseFloat(t.pricePerDay) || 0) * t.numDays * (t.numVehicles || 1), 0);
    const flightTotal = flights.reduce((sum, f) => 
      sum + (parseFloat(f.pricePerPax) || 0) * f.pax, 0);
    const carTotal = rentACar.reduce((sum, c) => 
      sum + (parseFloat(c.pricePerDay) || 0) * c.numDays, 0);
    const additionalTotal = additionalServices.reduce((sum, a) => 
      sum + (parseFloat(a.pricePerDay) || 0) * a.numDays * (a.numPeople || 1), 0);
    return hotelTotal + transportTotal + flightTotal + carTotal + additionalTotal;
  };

  const getFinalTotal = () => {
    const total = getGrandTotal();
    const marginAmount = (total * (parseFloat(overallMargin) || 0)) / 100;
    const commissionAmount = (total * (parseFloat(commission) || 0)) / 100;
    return total + marginAmount + commissionAmount;
  };

  // Save functions
  const saveProposal = (status: "NEW" | "CONFIRMED" = "NEW") => {
    const proposal: Proposal = {
      id: proposalId,
      reference,
      source,
      agencyId: agency,
      salesPersonId: salesPerson,
      destinationIds: selectedDestinations,
      estimatedNights,
      status,
      createdAt: existingProposal?.createdAt || new Date().toISOString(),
      hotels: hotels.map(h => ({ ...h, nights: calculateNights(h.checkin, h.checkout) })),
      transportation,
      flights,
      rentACar,
      additionalServices,
      overallMargin,
      commission,
      pdfLanguage,
      displayCurrency,
      proposalCurrency,
      proposalStartDate,
      proposalEndDate,
    };

    if (existingProposal) {
      updateProposal(proposalId, proposal);
      toast.success(t('proposalCreate.proposalUpdatedSuccess'));
    } else {
      addProposal(proposal);
      toast.success(t('proposalCreate.proposalSavedSuccess'));
    }
    
    return proposal.id;
  };

  const handleGenerateQuote = () => {
    // Validate Basic Information
    if (!validateBasicInfo()) {
      setActiveTab("basic");
      return;
    }

    // Validate Itinerary
    if (!validateItinerary()) {
      setActiveTab("itinerary");
      return;
    }

    // If all validations pass, save and navigate
    saveProposal("NEW");
    navigate("/proposals");
  };

  // Add/Remove functions
  const addHotel = () => setHotels([...hotels, {
    id: Date.now(), destinationId: "", hotelId: "", checkin: "", checkout: "", nights: 0,
    roomType: "", boardType: "", numRooms: 1, currency: "USD",
    pricePerNight: "", totalPrice: 0,
  }]);

  const duplicateHotel = (index: number) => {
    const hotel = { ...hotels[index], id: Date.now() };
    setHotels([...hotels, hotel]);
    toast.success(t('proposalCreate.hotelDuplicated'));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/proposals")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {existingProposal ? t('proposalCreate.editProposal') : t('proposalCreate.newProposal')}
            </h1>
            <p className="text-gray-600 mt-1">{t('proposalCreate.referenceLabel', { reference })}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleGenerateQuote} className="gap-2">
            <FileText className="h-4 w-4" />
            {t('proposalCreate.generateQuote')}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">{t('proposalCreate.basicInformation')}</TabsTrigger>
          <TabsTrigger value="itinerary">{t('proposalCreate.itineraryBuilder')}</TabsTrigger>
          <TabsTrigger value="summary">{t('proposalCreate.summaryAndPricing')}</TabsTrigger>
        </TabsList>

        {/* BASIC INFORMATION TAB */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('proposalCreate.proposalDetails')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('proposalCreate.proposalReference')}</Label>
                  <Input value={reference} disabled className="bg-gray-50" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="source">{t('proposalCreate.sourceChannelRequired')}</Label>
                  <Combobox
                    options={sources.filter(s => s.isActive).map((source) => ({
                      value: source.id,
                      label: source.name,
                    }))}
                    value={source}
                    onValueChange={setSource}
                    placeholder={t('proposalCreate.selectSource')}
                    searchPlaceholder={t('proposalCreate.searchSources')}
                  />
                </div>

                {/* Agency field - only shown for Travel Agency (B2B) source */}
                {source === "src2" && (
                  <div className="space-y-2">
                    <Label htmlFor="agency">{t('proposalCreate.agencyRequired')}</Label>
                    <Combobox
                      options={agencies.map((agency) => ({
                        value: agency.id,
                        label: agency.name,
                        sublabel: agency.country,
                      }))}
                      value={agency}
                      onValueChange={setAgency}
                      placeholder={t('proposalCreate.selectAgency')}
                      searchPlaceholder={t('proposalCreate.searchAgencies')}
                      emptyText={t('proposalCreate.noAgenciesFound')}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="sales">{t('proposalCreate.salesPerson')}</Label>
                  <Combobox
                    options={users.map((user) => ({
                      value: user.id,
                      label: user.name,
                      sublabel: user.email,
                    }))}
                    value={salesPerson}
                    onValueChange={setSalesPerson}
                    placeholder={t('proposalCreate.selectSalesPerson')}
                    searchPlaceholder={t('proposalCreate.searchUsers')}
                    emptyText={t('proposalCreate.noUsersFound')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destination">{t('proposalCreate.destinationsRequired')}</Label>
                  <MultiSelect
                    options={destinations.filter(d => d.isActive).map(d => ({
                      value: d.id,
                      label: `${d.name} (${d.country})`
                    }))}
                    selected={selectedDestinations}
                    onChange={setSelectedDestinations}
                    placeholder={t('proposalCreate.selectDestinations')}
                    emptyMessage={t('proposalCreate.noDestinationsFound')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nights">{t('proposalCreate.estimatedNights')}</Label>
                  <Input 
                    id="nights" 
                    type="number" 
                    placeholder={t('proposalCreate.autoCalculatedPlaceholder')}
                    value={estimatedNights} 
                    onChange={(e) => setEstimatedNights(e.target.value)} 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="proposalCurrency">{t('proposalCreate.proposalCurrency')}</Label>
                  <Select value={proposalCurrency} onValueChange={setProposalCurrency}>
                    <SelectTrigger id="proposalCurrency">
                      <SelectValue placeholder={t('proposalCreate.selectCurrency')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="TRY">TRY (₺)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="SAR">SAR (ر.س)</SelectItem>
                      <SelectItem value="AED">AED (د.إ)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="proposalStartDate">{t('proposalCreate.proposalStartDate')}</Label>
                  <Input 
                    id="proposalStartDate" 
                    type="date" 
                    value={proposalStartDate} 
                    onChange={(e) => setProposalStartDate(e.target.value)} 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="proposalEndDate">{t('proposalCreate.proposalEndDate')}</Label>
                  <Input 
                    id="proposalEndDate" 
                    type="date" 
                    value={proposalEndDate} 
                    onChange={(e) => setProposalEndDate(e.target.value)}
                    min={proposalStartDate}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={() => handleTabChange("itinerary")}>
                  {t('proposalCreate.continueToItinerary')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ITINERARY BUILDER TAB */}
        <TabsContent value="itinerary" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t('proposalCreate.buildYourItinerary')}</CardTitle>
                <RadioGroup value={inputMethod} onValueChange={(val: any) => setInputMethod(val)} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="forms" id="forms" />
                    <Label htmlFor="forms" className="cursor-pointer">{t('proposalCreate.nestedForms')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="table" id="table" />
                    <Label htmlFor="table" className="cursor-pointer">{t('proposalCreate.tableView')}</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardHeader>
            <CardContent>
              {/* Service Type Tabs */}
              <Tabs value={activeServiceTab} onValueChange={(val: any) => setActiveServiceTab(val)}>
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="hotels" className="gap-2">
                    <Hotel className="h-4 w-4" />
                    {t('proposals.hotels')} ({hotels.length})
                  </TabsTrigger>
                  <TabsTrigger value="transportation" className="gap-2">
                    <Bus className="h-4 w-4" />
                    {t('proposalCreate.transport')} ({transportation.length})
                  </TabsTrigger>
                  <TabsTrigger value="flights" className="gap-2">
                    <Plane className="h-4 w-4" />
                    {t('proposals.flights')} ({flights.length})
                  </TabsTrigger>
                  <TabsTrigger value="rentacar" className="gap-2">
                    <Car className="h-4 w-4" />
                    {t('proposalCreate.cars')} ({rentACar.length})
                  </TabsTrigger>
                  <TabsTrigger value="additional" className="gap-2">
                    <Package className="h-4 w-4" />
                    {t('proposalCreate.services')} ({additionalServices.length})
                  </TabsTrigger>
                </TabsList>

                {/* HOTELS TAB */}
                <TabsContent value="hotels" className="space-y-4 mt-6">
                  <HotelsBuilder
                    entries={hotels}
                    onChange={setHotels}
                    inputMethod={inputMethod}
                    overallMargin={overallMargin}
                    commission={commission}
                    selectedDestinations={selectedDestinations}
                    proposalCurrency={proposalCurrency}
                    proposalStartDate={proposalStartDate}
                    proposalEndDate={proposalEndDate}
                    estimatedNights={estimatedNights}
                  />
                </TabsContent>

                {/* Transportation, Flights, etc. - keeping them simple for now */}
                <TabsContent value="transportation" className="space-y-4 mt-6">
                  <TransportationBuilder
                    entries={transportation}
                    onChange={setTransportation}
                    inputMethod={inputMethod}
                    overallMargin={overallMargin}
                    commission={commission}
                    selectedDestinations={selectedDestinations}
                    proposalCurrency={proposalCurrency}
                    proposalStartDate={proposalStartDate}
                    proposalEndDate={proposalEndDate}
                  />
                </TabsContent>

                <TabsContent value="flights" className="space-y-4 mt-6">
                  <FlightsBuilder
                    entries={flights}
                    onChange={setFlights}
                    inputMethod={inputMethod}
                    overallMargin={overallMargin}
                    commission={commission}
                    selectedDestinations={selectedDestinations}
                    proposalCurrency={proposalCurrency}
                    proposalStartDate={proposalStartDate}
                    proposalEndDate={proposalEndDate}
                  />
                </TabsContent>

                <TabsContent value="rentacar" className="space-y-4 mt-6">
                  <RentACarBuilder
                    entries={rentACar}
                    onChange={setRentACar}
                    inputMethod={inputMethod}
                    overallMargin={overallMargin}
                    commission={commission}
                    selectedDestinations={selectedDestinations}
                    proposalCurrency={proposalCurrency}
                    proposalStartDate={proposalStartDate}
                    proposalEndDate={proposalEndDate}
                  />
                </TabsContent>

                <TabsContent value="additional" className="space-y-4 mt-6">
                  <AdditionalServicesBuilder
                    entries={additionalServices}
                    onChange={setAdditionalServices}
                    inputMethod={inputMethod}
                    overallMargin={overallMargin}
                    commission={commission}
                    selectedDestinations={selectedDestinations}
                    proposalCurrency={proposalCurrency}
                    proposalStartDate={proposalStartDate}
                    proposalEndDate={proposalEndDate}
                  />
                </TabsContent>
              </Tabs>

              <div className="flex justify-between pt-6 border-t mt-6">
                <Button variant="outline" onClick={() => handleTabChange("basic")}>
                  {t('proposalCreate.backToBasicInfo')}
                </Button>
                <Button onClick={() => handleTabChange("summary")}>
                  {t('proposalCreate.continueToSummary')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SUMMARY TAB */}
        <TabsContent value="summary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('proposalCreate.quotationSummary')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Service Breakdown */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">{t('proposalCreate.serviceBreakdown')}</h3>
                
                {hotels.some(h => h.pricePerNight) && (
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Hotel className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">{t('proposals.hotels')} ({hotels.length} {t('proposalCreate.entries')})</p>
                        <p className="text-sm text-gray-600">
                          {t('proposalCreate.totalNights')} {hotels.reduce((sum, h) => sum + calculateNights(h.checkin, h.checkout), 0)}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-lg">
                      {proposalCurrency} {hotels.reduce((sum, h) => {
                        const nights = calculateNights(h.checkin, h.checkout);
                        return sum + nights * (parseFloat(h.pricePerNight) || 0) * h.numRooms;
                      }, 0).toFixed(2)}
                    </span>
                  </div>
                )}

                {transportation.some(t => t.pricePerDay) && (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bus className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">{t('proposals.transportation')} ({transportation.length} {t('proposalCreate.entries')})</p>
                        <p className="text-sm text-gray-600">
                          {t('proposalCreate.totalDays')} {transportation.reduce((sum, t) => sum + t.numDays, 0)}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-lg">
                      {proposalCurrency} {transportation.reduce((sum, t) => 
                        sum + (parseFloat(t.pricePerDay) || 0) * t.numDays * (t.numVehicles || 1), 0).toFixed(2)}
                    </span>
                  </div>
                )}

                {flights.some(f => f.pricePerPax) && (
                  <div className="flex items-center justify-between p-3 bg-sky-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Plane className="h-5 w-5 text-sky-600" />
                      <div>
                        <p className="font-medium">{t('proposals.flights')} ({flights.length} {t('proposalCreate.entries')})</p>
                        <p className="text-sm text-gray-600">
                          {t('proposalCreate.totalPAX')} {flights.reduce((sum, f) => sum + f.pax, 0)}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-lg">
                      {proposalCurrency} {flights.reduce((sum, f) => 
                        sum + (parseFloat(f.pricePerPax) || 0) * f.pax, 0).toFixed(2)}
                    </span>
                  </div>
                )}

                {rentACar.some(c => c.pricePerDay) && (
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Car className="h-5 w-5 text-orange-600" />
                      <div>
                        <p className="font-medium">{t('proposals.rentACar')} ({rentACar.length} {t('proposalCreate.entries')})</p>
                        <p className="text-sm text-gray-600">
                          {t('proposalCreate.totalRentalDays')} {rentACar.reduce((sum, c) => sum + c.numDays, 0)}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-lg">
                      {proposalCurrency} {rentACar.reduce((sum, c) => 
                        sum + (parseFloat(c.pricePerDay) || 0) * c.numDays, 0).toFixed(2)}
                    </span>
                  </div>
                )}

                {additionalServices.some(a => a.pricePerDay) && (
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="font-medium">{t('proposals.additionalServices')} ({additionalServices.length} {t('proposalCreate.entries')})</p>
                        <p className="text-sm text-gray-600">
                          {t('proposalCreate.totalServiceDays')} {additionalServices.reduce((sum, a) => sum + a.numDays, 0)}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-lg">
                      {proposalCurrency} {additionalServices.reduce((sum, a) => 
                        sum + (parseFloat(a.pricePerDay) || 0) * a.numDays * (a.numPeople || 1), 0).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              {/* Financial Calculations */}
              <div className="border-t pt-6">
                <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                  <div className="flex justify-between text-lg">
                    <span className="font-medium">{t('proposals.subtotalNetCost')}</span>
                    <span className="font-bold">{proposalCurrency} {getGrandTotal().toFixed(2)}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="overallMargin">{t('proposalCreate.overallMarginPercent')}</Label>
                      <Input
                        id="overallMargin"
                        type="number"
                        step="0.01"
                        placeholder={t('proposalCreate.marginPlaceholder')}
                        value={overallMargin}
                        onChange={(e) => setOverallMargin(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="commission">{t('proposalCreate.commissionPercent')}</Label>
                      <Input
                        id="commission"
                        type="number"
                        step="0.01"
                        placeholder={t('proposalCreate.commissionPlaceholder')}
                        value={commission}
                        onChange={(e) => setCommission(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-blue-700">{t('proposalCreate.plusMargin')} ({overallMargin || 0}%)</span>
                    <span className="font-semibold text-blue-700">
                      +{proposalCurrency} {((getGrandTotal() * (parseFloat(overallMargin) || 0)) / 100).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-blue-700">{t('proposalCreate.plusCommission')} ({commission || 0}%)</span>
                    <span className="font-semibold text-blue-700">
                      +{proposalCurrency} {((getGrandTotal() * (parseFloat(commission) || 0)) / 100).toFixed(2)}
                    </span>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold">{t('proposals.totalSalePrice')}</span>
                      <span className="text-3xl font-bold text-green-600">
                        {proposalCurrency} {getFinalTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* PDF Settings */}
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-3">{t('proposalCreate.pdfOutputSettings')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pdfLanguage">{t('proposals.pdfLanguage')}</Label>
                    <Select value={pdfLanguage} onValueChange={setPdfLanguage}>
                      <SelectTrigger id="pdfLanguage">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">{t('proposalCreate.pdfLanguageEnglish')}</SelectItem>
                        <SelectItem value="arabic">{t('proposalCreate.pdfLanguageArabic')}</SelectItem>
                        <SelectItem value="turkish">{t('proposalCreate.pdfLanguageTurkish')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">{t('proposals.displayCurrency')}</Label>
                    <Select value={displayCurrency} onValueChange={setDisplayCurrency}>
                      <SelectTrigger id="currency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">USD ($)</SelectItem>
                        <SelectItem value="eur">EUR (€)</SelectItem>
                        <SelectItem value="try">TRY (₺)</SelectItem>
                        <SelectItem value="gbp">GBP (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-6 border-t">
                <Button variant="outline" onClick={() => handleTabChange("itinerary")}>
                  {t('proposalCreate.backToItinerary')}
                </Button>
                <Button onClick={handleGenerateQuote} className="gap-2">
                  <FileText className="h-4 w-4" />
                  {t('proposalCreate.generatePDFQuote')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Creation Method Modal */}
      <Dialog open={showCreationModal} onOpenChange={setShowCreationModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t('proposalCreate.createNewProposal')}</DialogTitle>
            <DialogDescription>
              {t('proposalCreate.createProposalDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {/* Start from Scratch */}
            <Button
              variant="outline"
              className="w-full h-auto py-4 flex flex-col items-center gap-2 hover:bg-blue-50 hover:border-blue-300"
              onClick={handleStartFromScratch}
            >
              <FileStack className="h-8 w-8 text-blue-600" />
              <div className="text-center">
                <p className="font-semibold">{t('proposalCreate.startFromScratch')}</p>
                <p className="text-sm text-gray-500">{t('proposalCreate.startFromScratchDescription')}</p>
              </div>
            </Button>

            {/* Copy Existing */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Copy className="h-4 w-4" />
                <span className="font-medium">{t('proposalCreate.orCopyExisting')}</span>
              </div>
              <Combobox
                options={proposals.map((proposal) => {
                  const destNames = proposal.destinationIds
                    ?.map(destId => destinations.find(d => d.id === destId)?.name)
                    .filter(Boolean)
                    .join(", ") || "";
                  return {
                    value: proposal.id,
                    label: proposal.reference,
                    sublabel: destNames,
                  };
                })}
                value={selectedProposalToCopy}
                onValueChange={setSelectedProposalToCopy}
                placeholder={t('proposalCreate.selectProposalToCopyPlaceholder')}
                searchPlaceholder={t('proposalCreate.searchProposals')}
                emptyText={t('proposalCreate.noProposalsFound')}
              />
              <Button
                className="w-full"
                onClick={handleCopyExisting}
                disabled={!selectedProposalToCopy}
              >
                <Copy className="h-4 w-4 mr-2" />
                {t('proposalCreate.copySelectedProposal')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}