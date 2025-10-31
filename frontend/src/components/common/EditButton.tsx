import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
const API_URL = import.meta.env.VITE_API_URL;
axios.defaults.baseURL = API_URL;

type EntryForm = {
    readonly id?: number;
    title: string;
    type: "MOVIE" | "TV_SHOW";
    director: string;
    budget: string;
    location: string;
    duration: string;
    durationUnit: "min" | "min/ep";
    yearOrTime: string;
};

const initialData: EntryForm = {
    title: "",
    type: "MOVIE",
    director: "",
    budget: "$",
    location: "",
    duration: "",
    durationUnit: "min",
    yearOrTime: "",
};

function ensureTvShowRange(value: string): string {
    const rangeRegex = /^\d{4}-\d{4}$/;
    if (rangeRegex.test(value)) return value;

    const singleYear = /^\d{4}$/;
    if (singleYear.test(value)) return `${value}-${value}`;

    const twoYears = value.match(/(\d{4}).*?(\d{4})/);
    if (twoYears) return `${twoYears[1]}-${twoYears[2]}`;
    return "";
}

function validate(form: EntryForm) {
    const errs: Record<string, string | null> = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.director.trim()) errs.director = "Director is required";
    if (!form.budget.trim()) errs.budget = "Budget is required";
    if (!form.location.trim()) errs.location = "Location is required";
    if (!form.duration.trim()) errs.duration = "Duration is required";

    if (form.type === "TV_SHOW") {
        const rangeRegex = /^\d{4}-\d{4}$/;
        if (!rangeRegex.test(form.yearOrTime)) {
            errs.yearOrTime = "For TV shows, Year/Time must be in YYYY-YYYY format";
        } else {
            const [start, end] = form.yearOrTime.split("-");
            if (Number(start) > Number(end)) {
                errs.yearOrTime = "Start year must be <= end year";
            }
        }
        if (form.durationUnit !== "min/ep") {
            errs.duration = "For TV shows, duration unit should be min/ep";
        }
    } else {
        if (!form.yearOrTime.trim()) errs.yearOrTime = "Year is required";
        if (form.durationUnit !== "min") {

        }
    }
    toast.error("Failed to save. Try again.");
    return errs;
}

export function EditButton({ editForm, fetchEntries }: { editForm: EntryForm ; fetchEntries: () => void }) {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<EntryForm>(editForm);
    const [errors, setErrors] = useState<Record<string, string | null>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            setForm(editForm);
            setErrors({});
        } else {
            setForm(initialData);
            setErrors({});
        }
    }, [open]);

    const handleChange = (field: keyof EntryForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setForm((prev) => ({ ...prev, [field]: value }));
        console.log("Updating field:", field, "to value:", value);
        setErrors((prev) => ({ ...prev, [field]: null }));
    };

    const handleTypeChange = (value: EntryForm["type"]) => {
        setForm((prev) => {
            const next: EntryForm = {
                ...prev,
                type: value,
                durationUnit: value === "TV_SHOW" ? "min/ep" : "min",
                yearOrTime: value === "TV_SHOW" ? ensureTvShowRange(prev.yearOrTime) : prev.yearOrTime,
            };
            return next;
        });
        setErrors((prev) => ({ ...prev, yearOrTime: null, duration: null }));
    };

    const handleDurationUnitChange = (value: EntryForm["durationUnit"]) => {
        setForm((prev) => ({ ...prev, durationUnit: value }));
        setErrors((prev) => ({ ...prev, duration: null }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        const payload: EntryForm = {
            ...form,
            yearOrTime: form.type === "TV_SHOW" ? ensureTvShowRange(form.yearOrTime) : form.yearOrTime,
        };

        const validation = validate(payload);
        const hasErrors = Object.values(validation).some(Boolean);
        if (hasErrors) {
            toast.error("Please fix the errors before submitting.");
            setErrors(validation);
            setLoading(false);
             return;
        }


        try {
            const apiPayload = {
                title: payload.title,
                type: payload.type,
                director: payload.director,
                budget: payload.budget,
                location: payload.location,
                duration: `${payload.duration} ${payload.durationUnit}`,
                yearOrTime: payload.yearOrTime,
            };
            await axios.put(`/entries/${editForm?.id}`, apiPayload, { withCredentials: true });
            toast.success("Entry updated successfully.");
            setOpen(false);
            fetchEntries();
        } catch (error :any) {
            if(error.response?.data?.cookies===false){
        localStorage.removeItem("token");
        window.location.reload()
      }
            toast.error("Failed to save. Try again.");
            console.error("Error submitting form:", error);
            setErrors((prev) => ({ ...prev, title: "Failed to save. Try again." }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen} >
            <form >
                <DialogTrigger asChild>
                    <Button variant="outline">Edit</Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[600px] overflow-y-auto h-auto  max-h-[95vh]">
                    <DialogHeader>
                        <DialogTitle>Edit Entry</DialogTitle>
                        <DialogDescription>Fill the details and click Save.</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" name="title" value={form.title} onChange={handleChange("title")} />
                            {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="type">Type</Label>
                            <Select onValueChange={(val) => handleTypeChange(val as EntryForm["type"])} value={form.type}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="MOVIE">Movie</SelectItem>
                                    <SelectItem value="TV_SHOW">TV Show</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="director">Director</Label>
                            <Input id="director" name="director" value={form.director} onChange={handleChange("director")} />
                            {errors.director && <p className="text-sm text-red-600 mt-1">{errors.director}</p>}
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="budget">Budget</Label>
                            <Input id="budget" name="budget" value={form.budget} onChange={handleChange("budget")} />
                            {errors.budget && <p className="text-sm text-red-600 mt-1">{errors.budget}</p>}
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="location">Location</Label>
                            <Input id="location" name="location" value={form.location} onChange={handleChange("location")} />
                            {errors.location && <p className="text-sm text-red-600 mt-1">{errors.location}</p>}
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="duration">Duration</Label>
                            <div className="flex gap-2 items-center">
                                <Input
                                    id="duration"
                                    name="duration"
                                    value={form.duration}
                                    onChange={handleChange("duration")}
                                    placeholder="e.g. 148"
                                />
                                <Select onValueChange={(val) => handleDurationUnitChange(val as EntryForm["durationUnit"])} value={form.durationUnit}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="min">min</SelectItem>
                                        <SelectItem value="min/ep">min/ep</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {errors.duration && <p className="text-sm text-red-600 mt-1">{errors.duration}</p>}
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="yearOrTime">Year/Time</Label>
                            <Input
                                id="yearOrTime"
                                name="yearOrTime"
                                value={form.yearOrTime}
                                onChange={handleChange("yearOrTime")}
                                placeholder={form.type === "TV_SHOW" ? "YYYY-YYYY (e.g. 2008-2013)" : "e.g. 2010"}
                            />
                            {errors.yearOrTime && <p className="text-sm text-red-600 mt-1">{errors.yearOrTime}</p>}
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" type="button" disabled={loading}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button onClick={handleSubmit} disabled={loading}>
                            {loading ? "Saving..." : "Save changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
}

export default EditButton;