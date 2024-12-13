import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Site } from "@/types/home";
import { useSiteStore } from "@/lib/store/home";

interface AddEditSiteDialogProps {
  editingSite: Site | null;
  setEditingSite: (site: Site | null) => void;
}

const AddEditSiteDialog: React.FC<AddEditSiteDialogProps> = ({
  editingSite,
  setEditingSite,
}) => {
  const [site, setSite] = useState<Site>({
    id: "",
    name: "",
    url: "",
    icon: "",
    category: "",
  });

  const addSite = useSiteStore((state) => state.addSite);
  const updateSite = useSiteStore((state) => state.updateSite);

  useEffect(() => {
    if (editingSite) {
      setSite(editingSite);
    }
  }, [editingSite]);

  const handleSubmit = () => {
    if (site.name && site.url) {
      if (editingSite) {
        updateSite(site);
      } else {
        addSite(site);
      }
      setSite({ id: "", name: "", url: "", icon: "", category: "" });
      setEditingSite(null);
    }
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Name
        </Label>
        <Input
          id="name"
          value={site.name}
          onChange={(e) => setSite({ ...site, name: e.target.value })}
          className="col-span-3 bg-indigo-800 text-white border-indigo-700"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="url" className="text-right">
          URL
        </Label>
        <Input
          id="url"
          value={site.url}
          onChange={(e) => setSite({ ...site, url: e.target.value })}
          className="col-span-3 bg-indigo-800 text-white border-indigo-700"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="icon" className="text-right">
          Icon
        </Label>
        <Input
          id="icon"
          value={site.icon}
          onChange={(e) => setSite({ ...site, icon: e.target.value })}
          className="col-span-3 bg-indigo-800 text-white border-indigo-700"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="category" className="text-right">
          Category
        </Label>
        <Input
          id="category"
          value={site.category}
          onChange={(e) => setSite({ ...site, category: e.target.value })}
          className="col-span-3 bg-indigo-800 text-white border-indigo-700"
        />
      </div>
      <Button
        onClick={handleSubmit}
        className="bg-indigo-600 hover:bg-indigo-500 text-white"
      >
        {editingSite ? "Update Site" : "Add Site"}
      </Button>
    </div>
  );
};

export default AddEditSiteDialog;
