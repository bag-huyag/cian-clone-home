import { useAdmin } from "@/hooks/useAdmin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, Clock, CheckCircle, XCircle, Archive } from "lucide-react";

export const AdminStats = () => {
  const { allListings, allProfiles, allRoles } = useAdmin();

  const pendingCount = allListings.filter((l) => l.status === "pending").length;
  const activeCount = allListings.filter((l) => l.status === "active").length;
  const archivedCount = allListings.filter((l) => l.status === "archived").length;
  const rejectedCount = allListings.filter((l) => l.status === "rejected").length;

  const adminCount = [...new Set(allRoles.filter((r) => r.role === "admin").map((r) => r.user_id))].length;
  const moderatorCount = [...new Set(allRoles.filter((r) => r.role === "moderator").map((r) => r.user_id))].length;

  const stats = [
    {
      title: "Всего объявлений",
      value: allListings.length,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "На модерации",
      value: pendingCount,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Активные",
      value: activeCount,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Отклонённые",
      value: rejectedCount,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      title: "В архиве",
      value: archivedCount,
      icon: Archive,
      color: "text-gray-600",
      bgColor: "bg-gray-100",
    },
    {
      title: "Пользователей",
      value: allProfiles.length,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      subtitle: `${adminCount} админ, ${moderatorCount} модер.`,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            {stat.subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
