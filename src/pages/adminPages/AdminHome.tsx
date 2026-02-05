import NavigationBar from "@/components/NavigationBar";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";




function AdminHome() {

    const navigate = useNavigate();

    return( 
    <div>
        <NavigationBar />
        <div className="flex flex-col  items-center min-h-screen bg-background text-primary-foreground">
            <h1 className="text-4xl font-bold mb-8">Admin Panel</h1>
            <div className="flex flex-col gap-4">
                <Button 
                    className="w-64"
                    onClick={() => navigate('/admin/add-recipe')}
                >
                    Legg til Oppskrift
                </Button>
                <Button 
                    className="w-64"
                    onClick={() => navigate('/admin/add-tag')}
                >
                    Legg til Tag
                </Button>
            </div>
        </div>

    </div>
    )
}

export default AdminHome;