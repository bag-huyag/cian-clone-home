import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Edit2, Trash2, Eye, Clock, CheckCircle, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserListings, UserListing } from "@/hooks/useUserListings";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { listings, deleteListing, updateListing } = useUserListings();
  const [activeTab, setActiveTab] = useState<"active" | "pending" | "archived">("active");

  const filteredListings = listings.filter((listing) => listing.status === activeTab);

  const handleDelete = (id: string) => {
    deleteListing(id);
    toast({
      title: "Нест карда шуд",
      description: "Эълон бомуваффақият нест карда шуд",
    });
  };

  const handleArchive = (id: string) => {
    updateListing(id, { status: "archived" });
    toast({
      title: "Архив карда шуд",
      description: "Эълон ба архив гузошта шуд",
    });
  };

  const handleActivate = (id: string) => {
    updateListing(id, { status: "active" });
    toast({
      title: "Фаъол карда шуд",
      description: "Эълон дубора фаъол шуд",
    });
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("tg-TJ") + " сомонӣ";
  };

  const getStatusBadge = (status: UserListing["status"]) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
            <CheckCircle className="w-3 h-3" />
            Фаъол
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
            <Clock className="w-3 h-3" />
            Дар интизорӣ
          </span>
        );
      case "archived":
        return (
          <span className="inline-flex items-center gap-1 text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
            <Archive className="w-3 h-3" />
            Архив
          </span>
        );
    }
  };

  const tabs = [
    { id: "active" as const, label: "Фаъол", count: listings.filter((l) => l.status === "active").length },
    { id: "pending" as const, label: "Дар интизорӣ", count: listings.filter((l) => l.status === "pending").length },
    { id: "archived" as const, label: "Архив", count: listings.filter((l) => l.status === "archived").length },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header favoritesCount={0} />

      <main className="container mx-auto px-4 py-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Бозгашт</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-foreground">Эълонҳои ман</h1>
          <Button onClick={() => navigate("/create")}>
            <Plus className="w-4 h-4 mr-2" />
            Эълони нав
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                activeTab === tab.id
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded-full">
                  {tab.count}
                </span>
              )}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>

        {/* Listings */}
        {filteredListings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-card rounded-xl border border-border">
            <div className="text-center">
              <p className="text-lg text-muted-foreground mb-2">
                {activeTab === "active" && "Эълонҳои фаъол нестанд"}
                {activeTab === "pending" && "Эълонҳо дар интизорӣ нестанд"}
                {activeTab === "archived" && "Архив холӣ аст"}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Эълони нав илова кунед
              </p>
              <Button variant="outline" onClick={() => navigate("/create")}>
                <Plus className="w-4 h-4 mr-2" />
                Эълон гузоштан
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredListings.map((listing) => (
              <article
                key={listing.id}
                className="bg-card rounded-xl border border-border overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <div className="sm:w-48 h-32 sm:h-auto flex-shrink-0">
                    <img
                      src={listing.images[0] || "/placeholder.svg"}
                      alt={listing.rooms}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusBadge(listing.status)}
                          <span className="text-xs text-muted-foreground">
                            {new Date(listing.createdAt).toLocaleDateString("ru-RU")}
                          </span>
                        </div>
                        <h3 className="font-semibold text-lg text-foreground mb-1">
                          {formatPrice(listing.price)}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-1">
                          {listing.rooms}, {listing.area} м²
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {listing.city}, {listing.district}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => navigate(`/edit/${listing.id}`)}
                          title="Таҳрир"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>

                        {listing.status !== "archived" ? (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleArchive(listing.id)}
                            title="Ба архив"
                          >
                            <Archive className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleActivate(listing.id)}
                            title="Фаъол кардан"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              title="Нест кардан"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Нест кардани эълон?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Ин амал барнагардонида мешавад. Эълон пурра нест карда мешавад.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Бекор</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(listing.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Нест кардан
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
