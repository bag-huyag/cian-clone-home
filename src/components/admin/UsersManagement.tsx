import { useState } from "react";
import { useAdmin } from "@/hooks/useAdmin";
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
import { Input } from "@/components/ui/input";
import { Search, UserPlus, UserMinus, Shield, ShieldCheck, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
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

const roleLabels: Record<string, string> = {
  admin: "Администратор",
  moderator: "Модератор",
  user: "Пользователь",
};

const roleIcons: Record<string, React.ReactNode> = {
  admin: <ShieldCheck className="h-3 w-3" />,
  moderator: <Shield className="h-3 w-3" />,
  user: <User className="h-3 w-3" />,
};

const roleColors: Record<string, string> = {
  admin: "bg-red-500",
  moderator: "bg-blue-500",
  user: "bg-gray-500",
};

export const UsersManagement = () => {
  const {
    allProfiles,
    isLoadingProfiles,
    allRoles,
    isLoadingRoles,
    addRole,
    removeRole,
  } = useAdmin();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const getUserRoles = (userId: string) => {
    return allRoles
      .filter((r) => r.user_id === userId)
      .map((r) => r.role);
  };

  const filteredProfiles = allProfiles.filter((profile) => {
    const matchesSearch =
      (profile.full_name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (profile.phone || "").includes(searchQuery);
    
    const userRoles = getUserRoles(profile.user_id);
    const matchesRole = roleFilter === "all" || userRoles.includes(roleFilter as "admin" | "moderator" | "user");
    
    return matchesSearch && matchesRole;
  });

  const handleAddRole = (userId: string, role: "admin" | "moderator" | "user") => {
    addRole.mutate({ userId, role });
  };

  const handleRemoveRole = (userId: string, role: "admin" | "moderator" | "user") => {
    removeRole.mutate({ userId, role });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (isLoadingProfiles || isLoadingRoles) {
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
            placeholder="Поиск по имени, телефону..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Роль" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все роли</SelectItem>
            <SelectItem value="admin">Администраторы</SelectItem>
            <SelectItem value="moderator">Модераторы</SelectItem>
            <SelectItem value="user">Пользователи</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Дата регистрации</TableHead>
              <TableHead>Имя</TableHead>
              <TableHead>Телефон</TableHead>
              <TableHead>Тип продавца</TableHead>
              <TableHead>Роли</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProfiles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Пользователи не найдены
                </TableCell>
              </TableRow>
            ) : (
              filteredProfiles.map((profile) => {
                const userRoles = getUserRoles(profile.user_id);
                return (
                  <TableRow key={profile.id}>
                    <TableCell className="whitespace-nowrap">
                      {formatDate(profile.created_at)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {profile.full_name || "Не указано"}
                    </TableCell>
                    <TableCell>{profile.phone || "Не указано"}</TableCell>
                    <TableCell>
                      {profile.seller_type === "owner" ? "Владелец" : 
                       profile.seller_type === "agent" ? "Агент" : 
                       profile.seller_type || "Не указано"}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {userRoles.length > 0 ? (
                          userRoles.map((role) => (
                            <Badge
                              key={role}
                              className={`${roleColors[role]} text-white flex items-center gap-1`}
                            >
                              {roleIcons[role]}
                              {roleLabels[role]}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">Без ролей</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Select
                          onValueChange={(role: string) => {
                            if (role === "admin" || role === "moderator" || role === "user") {
                              handleAddRole(profile.user_id, role);
                            }
                          }}
                        >
                          <SelectTrigger className="w-auto h-8 px-2">
                            <UserPlus className="h-4 w-4" />
                          </SelectTrigger>
                          <SelectContent>
                            {!userRoles.includes("admin") && (
                              <SelectItem value="admin">+ Администратор</SelectItem>
                            )}
                            {!userRoles.includes("moderator") && (
                              <SelectItem value="moderator">+ Модератор</SelectItem>
                            )}
                            {!userRoles.includes("user") && (
                              <SelectItem value="user">+ Пользователь</SelectItem>
                            )}
                          </SelectContent>
                        </Select>

                        {userRoles.length > 0 && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <UserMinus className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Удалить роль</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Выберите роль, которую хотите снять с пользователя{" "}
                                  <strong>{profile.full_name}</strong>
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <div className="flex flex-wrap gap-2 py-4">
                                {userRoles.map((role) => (
                                  <Button
                                    key={role}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleRemoveRole(profile.user_id, role)}
                                    className="flex items-center gap-1"
                                  >
                                    {roleIcons[role]}
                                    Удалить: {roleLabels[role]}
                                  </Button>
                                ))}
                              </div>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Отмена</AlertDialogCancel>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">
        Показано {filteredProfiles.length} из {allProfiles.length} пользователей
      </div>
    </div>
  );
};
