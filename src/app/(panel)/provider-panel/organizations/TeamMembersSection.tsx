"use client";

import { useState } from "react";
import { UserPlus, MoreVertical, Trash2, Crown, Info } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Badge } from "@/src/components/ui/badge";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { Separator } from "@/src/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { OrganizationMemberDTO } from "@/src/lib/dtos/OrganizationMembers.dto";
import { OrganizationMemberRoles } from "@/src/lib/enums/organization-members.enum";
import { OrganizationDTO } from "@/src/lib/dtos/Organizations.dto";
import { MemberRoleLabels } from "@/src/lib/utils/enum_labels/organization-members.labels";
import {
  _inviteMemberToOrganization,
  _removeMemberFromOrganization,
} from "@/src/lib/actions/organization_members.actions";
import { toastError, toastSuccess } from "@/src/lib/utils";
import {
  sortTeamMembersByRole,
  TeamMember,
  NewTeamMember,
} from "@/src/lib/utils/organization-members.utils";

export function TeamMembersSection({
  members,
  organization,
}: {
  members: OrganizationMemberDTO[];
  organization: OrganizationDTO;
}) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(
    members
      .map((m) => ({ ...m, roleName: MemberRoleLabels[m.role] }))
      .sort((a, b) =>
        sortTeamMembersByRole(a, b, organization.administratorId as number),
      ),
  );
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [newMember, setNewMember] = useState<NewTeamMember>({
    name: "",
    email: "",
    role: OrganizationMemberRoles.MEMBER,
  });

  const handleAddMember = async () => {
    const response = await _inviteMemberToOrganization({
      organizationId: organization.id,
      userEmail: newMember.email,
      role: newMember.role,
    });
    if (response.success) {
      setTeamMembers(
        [
          ...teamMembers,
          {
            ...(response.member as OrganizationMemberDTO),
            roleName:
              MemberRoleLabels[
                response.member?.role as OrganizationMemberRoles
              ],
          },
        ].sort((a, b) =>
          sortTeamMembersByRole(a, b, organization.administratorId as number),
        ),
      );
      setShowAddMemberDialog(false);
      toastSuccess("Miembro agregado correctamente", { duration: 30000 });
    } else {
      toastError(response.error || "Error al agregar el miembro");
    }
  };

  const handleRemoveMember = async (id: number) => {
    const response = await _removeMemberFromOrganization(id);
    if (response.success) {
      setTeamMembers(teamMembers.filter((m: TeamMember) => m.id !== id));
      toastSuccess("Miembro eliminado correctamente");
    } else {
      toastError("Error al eliminar el miembro");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Equipo</CardTitle>
            <CardDescription>
              Gestiona los miembros de tu organización
            </CardDescription>
          </div>
          <Dialog
            open={showAddMemberDialog}
            onOpenChange={setShowAddMemberDialog}
          >
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Agregar miembro
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar miembro</DialogTitle>
                <DialogDescription>
                  Agrega un nuevo miembro a tu organización. Se enviará un
                  correo de invitación a la dirección de correo electrónico
                  proporcionada.
                </DialogDescription>
              </DialogHeader>
              <div className="flex w-full gap-4">
                <div className="flex-1/4 space-y-2">
                  <Label htmlFor="member-email">Email</Label>
                  <Input
                    id="member-email"
                    type="email"
                    placeholder="juan.perez@email.com"
                    onChange={(e) =>
                      setNewMember({ ...newMember, email: e.target.value })
                    }
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor="member-role">Rol</Label>
                  <Select
                    defaultValue={newMember.role.toString()}
                    onValueChange={(value) =>
                      setNewMember({
                        ...newMember,
                        role: parseInt(value) as OrganizationMemberRoles,
                      })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        value={OrganizationMemberRoles.ADMIN.toString()}
                      >
                        Administrador
                      </SelectItem>
                      <SelectItem
                        value={OrganizationMemberRoles.MEMBER.toString()}
                      >
                        Miembro
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Alert className="max-w-md border-none bg-info-background text-info-foreground mt-2">
                <Info className="w-4 h-4 text-info!" />
                <AlertDescription>
                  Solo los administradores pueden gestionar el equipo y
                  configuración de la empresa
                </AlertDescription>
              </Alert>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowAddMemberDialog(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={handleAddMember}>Enviar invitación</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {teamMembers.map((member, index) => (
            <div key={member.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback>{member.user?.nameInitials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{member.user?.name}</p>
                      {member.user?.id === organization.administratorId && (
                        <Crown className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {member.userEmail}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right mr-2">
                    <Badge
                      variant={
                        member.isInvitation
                          ? "warning"
                          : member.user?.id === organization.administratorId
                            ? "secondary"
                            : member.role === OrganizationMemberRoles.ADMIN
                              ? "default"
                              : "outline"
                      }
                    >
                      {member.isInvitation
                        ? "Pendiente"
                        : member.user?.id === organization.administratorId
                          ? "Fundador"
                          : member.roleName}
                    </Badge>
                    {/* <p className="text-xs text-muted-foreground mt-1">
                      {member.createdAt.toLocaleDateString()}
                    </p> */}
                  </div>
                  {member.user?.id !== organization.administratorId && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleRemoveMember(member.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
              {index < teamMembers.length - 1 && <Separator className="mt-3" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
