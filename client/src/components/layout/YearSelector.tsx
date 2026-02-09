import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useLifeOSContext } from "@/context/LifeOSContext";
import { api } from "@/lib/api";

export function YearSelector() {
    const { state, setSelectedYear } = useLifeOSContext();
    const currentYear = new Date().getFullYear();
    // Generate a range of years, e.g., currentYear - 2 to currentYear + 2
    const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

    return (
        <div className="flex items-center gap-2">
            <Select
                value={state.selectedYear.toString()}
                onValueChange={(val) => setSelectedYear(parseInt(val))}
            >
                <SelectTrigger className="w-[100px] h-9">
                    <SelectValue placeholder="Año" />
                </SelectTrigger>
                <SelectContent>
                    {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                            {year}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {state.selectedYear === currentYear && (
                <Button
                    variant="outline"
                    size="sm"
                    className="hidden lg:flex"
                    onClick={async () => {
                        if (confirm(`¿Estás seguro de cerrar el año ${state.selectedYear}? Esto moverá tus metas y hábitos pendientes al ${state.selectedYear + 1}.`)) {
                            try {
                                await api.years.close(state.selectedYear);
                                alert(`Año ${state.selectedYear} cerrado exitosamente. Bienvenido al ${state.selectedYear + 1}.`);
                                setSelectedYear(state.selectedYear + 1);
                            } catch (error) {
                                console.error(error);
                                alert("Ocurrió un error al cerrar el año.");
                            }
                        }
                    }}
                >
                    Cerrar Año
                </Button>
            )}
        </div>
    );
}
