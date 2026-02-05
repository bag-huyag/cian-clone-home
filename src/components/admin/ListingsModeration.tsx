import { useState } from "react";
import { useAdmin, ListingWithUser } from "@/hooks/useAdmin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, X, Trash2, Eye, Search, Pencil, CheckSquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { EditListingDialog } from "./EditListingDialog";

const statusLabels: Record<string, string> = {
  pending: "На модерации",
  active: "Активно",
  archived: "В архиве",
  rejected: "Отклонено",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500",
  active: "bg-green-500",
  archived: "bg-gray-500",
  rejected: "bg-red-500",
};

export const ListingsModeration = () => {
  const { allListings, isLoadingListings, updateListingStatus, deleteListing, bulkUpdateListingStatus, bulkDeleteListings } = useAdmin();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editingListing, setEditingListing] = useState<ListingWithUser | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const filteredListings = allListings.filter((listing) => {
    const matchesSearch =
      listing.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.seller_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.seller_phone.includes(searchQuery);
    
    const matchesStatus = statusFilter === "all" || listing.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const allSelected = filteredListings.length > 0 && filteredListings.every((l) => selectedIds.has(l.id));
  const someSelected = selectedIds.size > 0;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filteredListings.map((l) => l.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkStatusChange = (status: string) => {
    bulkUpdateListingStatus.mutate(
      { ids: Array.from(selectedIds), status },
      { onSuccess: () => setSelectedIds(new Set()) }
    );
  };

  const handleBulkDelete = () => {
    bulkDeleteListings.mutate(Array.from(selectedIds), {
      onSuccess: () => {
        setSelectedIds(new Set());
        setBulkDeleteOpen(false);
      },
    });
  };

  const handleStatusChange = (id: string, status: string) => {
    updateListingStatus.mutate({ id, status });
  };

  const handleDelete = (id: string) => {
    deleteListing.mutate(id);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU").format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (isLoadingListings) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по городу, району, продавцу..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Статус" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="pending">На модерации</SelectItem>
            <SelectItem value="active">Активные</SelectItem>
            <SelectItem value="archived">В архиве</SelectItem>
            <SelectItem value="rejected">Отклонённые</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {someSelected && (
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <CheckSquare className="h-4 w-4" />
          <span className="text-sm font-medium">Выбрано: {selectedIds.size}</span>
          <div className="flex-1" />
          <Select onValueChange={handleBulkStatusChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Изменить статус" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">На модерации</SelectItem>
              <SelectItem value="active">Активные</SelectItem>
              <SelectItem value="archived">В архив</SelectItem>
              <SelectItem value="rejected">Отклонить</SelectItem>
            </SelectContent>
          </Select>
          <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-1" />
                Удалить
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Удалить {selectedIds.size} объявлений?</AlertDialogTitle>
                <AlertDialogDescription>
                  Это действие нельзя отменить. Выбранные объявления будут удалены навсегда.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Отмена</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleBulkDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Удалить
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button variant="outline" size="sm" onClick={() => setSelectedIds(new Set())}>
            Снять выделение
          </Button>
        </div>
      )}

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Выбрать все"
                />
              </TableHead>
              <TableHead>Дата</TableHead>
              <TableHead>Локация</TableHead>
              <TableHead>Тип</TableHead>
              <TableHead>Цена</TableHead>
              <TableHead>Продавец</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredListings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  Объявления не найдены
                </TableCell>
              </TableRow>
            ) : (
              filteredListings.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(listing.id)}
                      onCheckedChange={(checked) => handleSelectOne(listing.id, !!checked)}
                      aria-label={`Выбрать ${listing.city}`}
                    />
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatDate(listing.created_at)}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{listing.city}</div>
                      <div className="text-sm text-muted-foreground">{listing.district}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>{listing.property_type}</div>
                      <div className="text-sm text-muted-foreground">
                        {listing.rooms}, {listing.area} м²
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    ${formatPrice(listing.price)}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{listing.seller_name}</div>
                      <div className="text-sm text-muted-foreground">{listing.seller_phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${statusColors[listing.status]} text-white`}>
                      {statusLabels[listing.status] || listing.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/property/${listing.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingListing(listing)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      
                      {listing.status === "pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleStatusChange(listing.id, "active")}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleStatusChange(listing.id, "rejected")}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Удалить объявление?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Это действие нельзя отменить. Объявление будет удалено навсегда.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Отмена</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(listing.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Удалить
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">
        Показано {filteredListings.length} из {allListings.length} объявлений
      </div>

      <EditListingDialog
        listing={editingListing}
        open={!!editingListing}
        onOpenChange={(open) => !open && setEditingListing(null)}
      />
    </div>
  );
};
