import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UploadInventoryForm from "@/components/upload-inventory-form";

export default function NuevoInventarioPage() {
  return (
    <div className="flex-1 p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Nuevo inventario</CardTitle>
        </CardHeader>
        <CardContent>
          <UploadInventoryForm />
        </CardContent>
      </Card>
    </div>
  );
}
