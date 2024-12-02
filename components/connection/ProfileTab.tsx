import { useState, useEffect } from "react";
import styled from "styled-components";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Search } from "lucide-react";
import { useApiService } from "@/services/api";

interface ProfileTabProps {
  toast: (props: { title: string; description: string }) => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: calc(100vh - 4rem);
  overflow-y: auto;
  padding: 1rem;

  @media (orientation: landscape) and (max-width: 768px) {
    flex-direction: row;
    flex-wrap: wrap;
  }
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const Grid = styled.div`
  display: grid;
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (orientation: landscape) and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FlexItem = styled.div`
  flex: 1;
  width: 100%;
`;

const FlexCenter = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

interface Profile {
  name: string;
  autoConnect: boolean;
  mode: "local" | "remote";
  host: string;
  port: string;
  guiding: "internal" | "external";
  indiWebManager: boolean;
}

export function ProfileTab({ toast }: ProfileTabProps) {
  const { fetchProfileData, updateProfileData } = useApiService();
  const [profile, setProfile] = useState({
    name: "",
    autoConnect: false,
    mode: "remote",
    host: "",
    port: "",
    guiding: "internal",
    indiWebManager: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = (field: string, value: string | boolean) => {
    let error = "";
    if (field === "name" && typeof value === "string" && value.trim() === "") {
      error = "名称不能为空";
    }
    if (field === "port" && typeof value === "string" && !/^\d+$/.test(value)) {
      error = "端口必须是数字";
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
    return error === "";
  };

  useEffect(() => {
    fetchProfileData().then(setProfile);
  }, [fetchProfileData]);

  const handleChange = (field: string, value: string | boolean) => {
    if (validate(field, value)) {
      setProfile((prev) => ({ ...prev, [field]: value }));
      updateProfileData({ [field]: value })
        .then(() => {
          toast({
            title: "Profile Updated",
            description: `${field} 已更新。`,
          });
        })
        .catch((error) => {
          toast({ title: "更新失败", description: error.message });
        });
    }
  };

  return (
    <Container>
      <Row>
        <FlexItem>
          <Label htmlFor="name">Profile Name</Label>
          <Input
            id="name"
            value={profile.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="mt-1"
          />
          {errors.name && <span className="text-red-500">{errors.name}</span>}
        </FlexItem>
        <FlexCenter>
          <Switch
            id="autoConnect"
            checked={profile.autoConnect}
            onCheckedChange={(checked) => handleChange("autoConnect", checked)}
          />
          <Label htmlFor="autoConnect">Auto Connect</Label>
        </FlexCenter>
      </Row>

      <Grid>
        <div>
          <Label>Connection Mode</Label>
          <RadioGroup
            value={profile.mode}
            onValueChange={(value) => handleChange("mode", value)}
            className="flex gap-4 mt-1"
          >
            <FlexCenter>
              <RadioGroupItem value="local" id="local" />
              <Label htmlFor="local">Local</Label>
            </FlexCenter>
            <FlexCenter>
              <RadioGroupItem value="remote" id="remote" />
              <Label htmlFor="remote">Remote</Label>
            </FlexCenter>
          </RadioGroup>
        </div>
        <div>
          <Label htmlFor="guiding">Guiding</Label>
          <Select
            value={profile.guiding}
            onValueChange={(value) => handleChange("guiding", value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select guiding" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="internal">Internal</SelectItem>
              <SelectItem value="external">External</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Grid>

      <Grid>
        <div>
          <Label htmlFor="host">Host</Label>
          <Input
            id="host"
            value={profile.host}
            onChange={(e) => handleChange("host", e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="port">Port</Label>
          <Input
            id="port"
            value={profile.port}
            onChange={(e) => handleChange("port", e.target.value)}
            className="mt-1"
          />
          {errors.port && <span className="text-red-500">{errors.port}</span>}
        </div>
      </Grid>

      <Row>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <FlexCenter>
                <Checkbox
                  id="indiWebManager"
                  checked={profile.indiWebManager}
                  onCheckedChange={(checked) =>
                    handleChange("indiWebManager", checked)
                  }
                />
                <Label htmlFor="indiWebManager">INDI Web Manager</Label>
              </FlexCenter>
            </TooltipTrigger>
            <TooltipContent>
              <p>Enable INDI Web Manager for advanced device control</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            toast({
              title: "Scanning for devices...",
              description: "This may take a few moments.",
            })
          }
        >
          <Search className="w-4 h-4 mr-2" />
          Scan Network
        </Button>
      </Row>
    </Container>
  );
}
