import { useNavigate, useParams } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, FileText, CheckCircle2, Edit, Trash2 } from "lucide-react";
import { useData } from "../contexts/DataContext";
import { toast } from "sonner";
import { ConfirmDialog } from "../components/ui/confirm-dialog";
import { useConfirm } from "../hooks/useConfirm";
import { generateProposalPDF } from "../utils/pdfGenerator";
import { useTranslation } from "react-i18next";

export function ProposalViewPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { getProposal, updateProposal, deleteProposal, getHotel, getDestination, getAgency, getUser, getSource, companyInfo } = useData();
  const confirmDialog = useConfirm();

  const proposal = id ? getProposal(id) : null;

  if (!proposal) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/proposals")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('proposals.proposalNotFound')}</h1>
          </div>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">{t('proposals.proposalNotFoundDescription')}</p>
            <Button onClick={() => navigate("/proposals")} className="mt-4">
              {t('proposals.backToProposals')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const calculateNights = (checkin: string, checkout: string) => {
    if (!checkin || !checkout) return 0;
    const start = new Date(checkin);
    const end = new Date(checkout);
    const diff = end.getTime() - start.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const getGrandTotal = () => {
    const hotelTotal = proposal.hotels.reduce((sum, h) => {
      const nights = calculateNights(h.checkin, h.checkout);
      return sum + nights * (parseFloat(h.pricePerNight) || 0) * h.numRooms;
    }, 0);
    const transportTotal = proposal.transportation.reduce((sum, t) => 
      sum + (parseFloat(t.pricePerDay) || 0) * t.numDays, 0);
    const flightTotal = proposal.flights.reduce((sum, f) => 
      sum + (parseFloat(f.pricePerPax) || 0) * f.pax, 0);
    const carTotal = proposal.rentACar.reduce((sum, c) => 
      sum + (parseFloat(c.pricePerDay) || 0) * c.numDays, 0);
    const additionalTotal = proposal.additionalServices.reduce((sum, a) => 
      sum + (parseFloat(a.pricePerDay) || 0) * a.numDays, 0);
    return hotelTotal + transportTotal + flightTotal + carTotal + additionalTotal;
  };

  const getFinalTotal = () => {
    const total = getGrandTotal();
    const marginAmount = (total * (parseFloat(proposal.overallMargin) || 0)) / 100;
    const commissionAmount = (total * (parseFloat(proposal.commission) || 0)) / 100;
    return total + marginAmount + commissionAmount;
  };

  const handleConfirm = () => {
    navigate(`/proposals/${id}/confirm`);
  };

  const handleEdit = () => {
    navigate(`/proposals/new?edit=${id}`);
  };

  const handleDelete = async () => {
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
      navigate("/proposals");
    }
  };

  const handleGeneratePDF = () => {
    const agency = getAgency(proposal.agencyId);
    const salesPerson = getUser(proposal.salesPersonId);
    const destinations = proposal.destinationIds.map(id => getDestination(id));
    const hotels = proposal.hotels.map(h => getHotel(h.hotelId));
    
    generateProposalPDF(
      proposal,
      agency,
      salesPerson,
      destinations,
      hotels,
      companyInfo,
      {
        language: proposal.pdfLanguage,
        showPricing: true,
      }
    );
    toast.success(t('proposals.pdfGeneratedSuccess'));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return <Badge className="bg-blue-500">{t('proposals.statuses.NEW')}</Badge>;
      case "CONFIRMED":
        return <Badge className="bg-green-500">{t('proposals.statuses.CONFIRMED')}</Badge>;
      case "CANCELLED":
        return <Badge className="bg-red-500">{t('proposals.statuses.CANCELLED')}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
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
            <h1 className="text-3xl font-bold text-gray-900">{t('proposals.proposalDetails')}</h1>
            <p className="text-gray-600 mt-1">{proposal.reference}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEdit} className="gap-2">
            <Edit className="h-4 w-4" />
            {t('common.edit')}
          </Button>
          <Button variant="outline" onClick={handleDelete} className="gap-2 text-red-600 hover:text-red-700">
            <Trash2 className="h-4 w-4" />
            {t('common.delete')}
          </Button>
          <Button variant="outline" onClick={handleGeneratePDF} className="gap-2">
            <FileText className="h-4 w-4" />
            {t('proposals.generatePDF')}
          </Button>
          {proposal.status === "NEW" && (
            <Button onClick={handleConfirm} className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              {t('proposals.confirmProposal')}
            </Button>
          )}
        </div>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t('proposals.basicInformation')}</CardTitle>
            {getStatusBadge(proposal.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">{t('proposals.referenceNumber')}</p>
              <p className="font-semibold">{proposal.reference}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">{t('proposals.sourceChannel')}</p>
              <p className="font-semibold capitalize">{getSource(proposal.source)?.name || proposal.source}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">{t('proposals.agency')}</p>
              <p className="font-semibold">{getAgency(proposal.agencyId)?.name || t('proposals.unknownAgency')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">{t('proposals.salesPerson')}</p>
              <p className="font-semibold">{getUser(proposal.salesPersonId)?.name || t('proposals.unknownUser')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">{t('proposals.destinations')}</p>
              <p className="font-semibold">
                {proposal.destinationIds.map(id => getDestination(id)?.name).filter(Boolean).join(', ') || t('proposals.unknown')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">{t('proposals.createdDate')}</p>
              <p className="font-semibold">{new Date(proposal.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services */}
      {proposal.hotels.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('proposals.hotels')} ({proposal.hotels.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {proposal.hotels.map((hotel, index) => {
                const hotelData = getHotel(hotel.hotelId);
                const destinationData = getDestination(hotel.destinationId);
                return (
                  <div key={hotel.id} className="border rounded-lg p-4 bg-blue-50">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">{t('proposals.cityAndHotel')}</p>
                        <p className="font-semibold">{destinationData?.name || t('proposals.unknown')}</p>
                        <p className="text-sm">{hotelData?.name || t('proposals.unknownHotel')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{t('proposals.dates')}</p>
                        <p className="font-semibold">{hotel.checkin} → {hotel.checkout}</p>
                        <p className="text-sm">{hotel.nights} {t('proposals.nights')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{t('proposals.roomDetails')}</p>
                        <p className="font-semibold">{hotel.numRooms}x {hotel.roomType}</p>
                        <p className="text-sm">{hotel.boardType}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{t('proposals.totalPrice')}</p>
                        <p className="font-bold text-lg text-green-600">
                          {hotel.currency} {hotel.totalPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transportation */}
      {proposal.transportation.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('proposals.transportation')} ({proposal.transportation.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {proposal.transportation.map((transport) => {
                const destinationData = getDestination(transport.destinationId);
                return (
                  <div key={transport.id} className="border rounded-lg p-4 bg-purple-50">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">{t('proposals.destination')}</p>
                        <p className="font-semibold">{destinationData?.name || t('proposals.unknown')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{t('proposals.dateAndVehicle')}</p>
                        <p className="font-semibold">{transport.date}</p>
                        <p className="text-sm">{transport.vehicleType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{t('common.description')}</p>
                        <p className="font-semibold">{transport.description}</p>
                        <p className="text-sm">{transport.numDays} {t('proposals.daysPlural')} × {transport.numVehicles} {t('proposals.vehiclesPlural')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{t('proposals.totalPrice')}</p>
                        <p className="font-bold text-lg text-green-600">
                          {transport.currency} {transport.totalPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Flights */}
      {proposal.flights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('proposals.flights')} ({proposal.flights.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {proposal.flights.map((flight) => (
                <div key={flight.id} className="border rounded-lg p-4 bg-sky-50">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">{t('proposals.route')}</p>
                      <p className="font-semibold">{flight.departure}</p>
                      <p className="text-sm">→ {flight.arrival}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{t('proposals.dateAndTime')}</p>
                      <p className="font-semibold">{flight.date}</p>
                      <p className="text-sm">{flight.departureTime} - {flight.arrivalTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{t('proposals.flightDetails')}</p>
                      <p className="font-semibold">{flight.airline}</p>
                      <p className="text-sm">{flight.flightType} · {flight.pax} PAX</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{t('proposals.totalPrice')}</p>
                      <p className="font-bold text-lg text-green-600">
                        {flight.currency} {flight.totalPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rent a Car */}
      {proposal.rentACar.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('proposals.rentACar')} ({proposal.rentACar.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {proposal.rentACar.map((car) => {
                const destinationData = getDestination(car.destinationId);
                return (
                  <div key={car.id} className="border rounded-lg p-4 bg-orange-50">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">{t('proposals.destination')}</p>
                        <p className="font-semibold">{destinationData?.name || t('proposals.unknown')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{t('proposals.dates')}</p>
                        <p className="font-semibold">{car.pickupDate} → {car.dropoffDate}</p>
                        <p className="text-sm">{car.numDays} {t('proposals.daysPlural')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{t('proposals.carDetails')}</p>
                        <p className="font-semibold">{car.carType}</p>
                        <p className="text-sm">{car.pickupLocation} → {car.dropoffLocation}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{t('proposals.totalPrice')}</p>
                        <p className="font-bold text-lg text-green-600">
                          {car.currency} {car.totalPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Services */}
      {proposal.additionalServices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('proposals.additionalServices')} ({proposal.additionalServices.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {proposal.additionalServices.map((service) => {
                const destinationData = getDestination(service.destinationId);
                return (
                  <div key={service.id} className="border rounded-lg p-4 bg-green-50">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">{t('proposals.destination')}</p>
                        <p className="font-semibold">{destinationData?.name || t('proposals.unknown')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{t('proposals.dateAndType')}</p>
                        <p className="font-semibold">{service.date}</p>
                        <p className="text-sm">{service.serviceType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{t('common.description')}</p>
                        <p className="font-semibold">{service.description}</p>
                        <p className="text-sm">{service.numPax} PAX × {service.numDays} {t('proposals.daysPlural')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{t('proposals.totalPrice')}</p>
                        <p className="font-bold text-lg text-green-600">
                          {service.currency} {service.totalPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Financial Summary */}
      <Card>
        <CardHeader>
          <CardTitle>{t('proposals.financialSummary')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-lg">
              <span className="text-gray-600">{t('proposals.subtotalNetCost')}</span>
              <span className="font-bold">${getGrandTotal().toFixed(2)}</span>
            </div>
            
            {proposal.overallMargin && parseFloat(proposal.overallMargin) > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">{t('proposals.margin')} ({proposal.overallMargin}%)</span>
                <span className="font-semibold text-blue-600">
                  +${((getGrandTotal() * parseFloat(proposal.overallMargin)) / 100).toFixed(2)}
                </span>
              </div>
            )}
            
            {proposal.commission && parseFloat(proposal.commission) > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">{t('proposals.commission')} ({proposal.commission}%)</span>
                <span className="font-semibold text-blue-600">
                  +${((getGrandTotal() * parseFloat(proposal.commission)) / 100).toFixed(2)}
                </span>
              </div>
            )}
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">{t('proposals.totalSalePrice')}</span>
                <span className="text-3xl font-bold text-green-600">
                  ${getFinalTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PDF Settings */}
      <Card>
        <CardHeader>
          <CardTitle>{t('proposals.pdfSettings')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">{t('proposals.pdfLanguage')}</p>
              <p className="font-semibold capitalize">{proposal.pdfLanguage}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">{t('proposals.displayCurrency')}</p>
              <p className="font-semibold uppercase">{proposal.displayCurrency}</p>
            </div>
          </div>
        </CardContent>
      </Card>

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
