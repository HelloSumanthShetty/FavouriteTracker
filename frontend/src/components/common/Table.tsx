import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;
axios.defaults.baseURL = API_URL;

type Entry = {
  id: number;
  title: string;
  type: string;
  director: string;
  budget: string;
  location: string;
  duration: string;
  yearOrTime: string;
};

const TableComponent = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [limit] = useState<number>(10);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fetchedFirstRef = useRef(false);
  const fetchEntries = async (append = false, cursor?: number | null): Promise<void> => {
    if (loading) return;
    setLoading(true);
    try {
      const params: any = { limit };
      if (typeof cursor === "number") params.cursor = cursor;

      const response = await axios.get("/entries", { params });
      const res = response.data;

        if (res?.success) {
          setNextCursor(res.nextCursor ?? null);
          setEntries(prev => (append ? [...prev, ...res.items] : res.items));
        } else {
          console.error("Unexpected API response shape:", res);
        }
      
    } catch (error) {
      console.error("Error fetching entries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!fetchedFirstRef.current) {
      fetchedFirstRef.current = true;
      fetchEntries(false, undefined);
    }
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const nearBottom = scrollTop + clientHeight >= scrollHeight - 100;

    if (nearBottom && !loading && nextCursor) {
      fetchEntries(true, nextCursor);
    }
  };
  const handleEdit = (id: number) => {
    console.log("Edit entry with ID:", id);
    
  } 
  const handleDelete = async (id: number) => {  
    try {
      const confirmed = window.confirm("Are you sure you want to delete this entry?");
      if (!confirmed) return;

      await axios.delete(`/entries/${id}`);
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
    } catch (error) {     
      console.error("Error deleting entry:", error);
    } 
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={`overflow-y-auto w-full h-auto max-h-[400px]  `}
    >
      <Table >
        <TableCaption  >{entries.length > 0 ? `A list of your favorite entries.`: `Add you Favorites TV and MOVIES`}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Director</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Year/Time</TableHead>
            <TableHead>Edit</TableHead>
            <TableHead>Delete</TableHead>
            
          </TableRow>
        </TableHeader>

        <TableBody className="dark:text-white truncate ">
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell className="font-medium">{entry?.id}</TableCell>
              <TableCell className="font-medium">{entry?.title ? entry.title.slice(0, 14) : "" }</TableCell>
              <TableCell>{entry?.type  }</TableCell>
              <TableCell>{entry?.director ? entry.director.slice(0, 14) : ""}</TableCell>
              <TableCell>{entry?.budget}</TableCell>
              <TableCell>{entry?.location ? entry.location.slice(0, 14) : ""}</TableCell>
              <TableCell>{entry?.duration}</TableCell>
              <TableCell>{entry?.yearOrTime}</TableCell>
              <TableCell>
                <Button className="hover:scale-101 hover:bg-green-500" onClick={() => handleEdit(entry.id)}>Edit</Button>
              </TableCell>
              <TableCell>
                <Button className="hover:scale-101 hover:bg-red-500" onClick={() => handleDelete(entry.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {loading && (
        <p className="p-4 text-center text-gray-500">Loading more...</p>
      )}
    </div>
  );
};

export default TableComponent;