import * as React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import ImageFraming from "./image_framing";

const ObjectFinding: React.FC = () => {

  return (
    <Card className="w-100">
      <CardHeader>
        <h2>构图助手</h2>
      </CardHeader>
      <CardContent>
        <ImageFraming />
      </CardContent>
    </Card>
  );
};

export default ObjectFinding;