import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import axios from "axios";
import React, { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;
axios.defaults.baseURL = API_URL;
type Entry = {
    id: number;
    title: string;      
    director: string;
    budget: number;
    location: string;
    duration: number;
    yearOrTime: number;
};



const TableComponent = () => {
    const [entries, setEntries] = useState<Entry[] | null>(null);

const fetchEntries = async (): Promise<void> => {
    const response = await axios.get("/entries");
    console.log("Fetched entries:", response.data.items);
    setEntries([...response.data.items]);
    console.log("Entries set in state:", [...response.data.items]);
}
    useEffect(() => {
        fetchEntries()
            .catch((error) => console.error("Error fetching entries:", error));
    }, []);

    return (
        <Table >
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
    <TableRow>
      <TableHead className="w-[100px] ">title</TableHead>
      <TableHead>director</TableHead>
      <TableHead>budget</TableHead>
      <TableHead>location</TableHead>
      <TableHead>duration</TableHead>
      <TableHead>yearOrTime</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody className="dark:text-white ">
        {entries?.map((entry) => (
          <TableRow key={entry.id}>
            <TableCell className="font-medium">{entry?.title}</TableCell>
            <TableCell>{entry?.director}</TableCell>
            <TableCell>{entry?.budget}</TableCell>
            <TableCell>{entry?.location}</TableCell>
            <TableCell>{entry?.duration}</TableCell>
            <TableCell>{entry?.yearOrTime}</TableCell>
          </TableRow>
        ))}
    </TableBody>
</Table>
)
};
export default TableComponent