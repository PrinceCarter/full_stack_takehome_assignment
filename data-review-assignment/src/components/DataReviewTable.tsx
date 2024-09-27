import { useState, useEffect } from "react";
import {
  Table,
  TableCaption,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "./table";
import { Button } from "components/button";
import { Input } from "components/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "components/dropdown-menu";
import { Tooltip, TooltipTrigger, TooltipContent } from "components/tooltip";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "components/dialog";
import { Parser } from "json2csv";

interface Record {
  id: number;
  name: string;
  email: string;
  street: string;
  city: string;
  zipcode: string;
  phone: string;
  status: string;
  errors?: {
    [key: string]: { message: string; severity: string };
  };
}

export default function DataReviewTable() {
  const [data, setData] = useState<Record[]>([]);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [nameFilter, setNameFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [filteredData, setFilteredData] = useState<Record[]>(data);
  const [modalData, setModalData] = useState<Record | null>(null);

  // Fetch data from the API
  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/data");
      const json = await response.json();
      // Records are already flattened, no need to flatten again.
      setData(json.records);
      setFilteredData(json.records);
    }
    fetchData();
  }, []);

  // Filter logic
  useEffect(() => {
    let updatedData = data;

    if (statusFilter) {
      updatedData = updatedData.filter(
        (record) => record.status === statusFilter
      );
    }

    if (nameFilter) {
      updatedData = updatedData.filter((record) =>
        record.name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    setFilteredData(updatedData);
    // Reset to the first page whenever filters change
    setCurrentPage(1);
  }, [statusFilter, nameFilter, data]);

  // Get cell color based on error severity
  const getCellColor = (field: keyof Record, errors?: Record["errors"]) => {
    if (errors && errors[field]) {
      switch (errors[field].severity) {
        case "critical":
          return "bg-red-100";
        case "warning":
          return "bg-yellow-100";
        default:
          return "bg-green-100";
      }
    }
    return "bg-green-100";
  };

  // CSV Export Function
  const exportToCSV = () => {
    try {
      // Create a new instance of the parser to convert JSON to CSV
      const parser = new Parser();
      // Returns a CSV string based on the filtered JSON objects
      const csv = parser.parse(filteredData);

      // Create a Blob object that represents the CSV data
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      // Create a URL object that represents the Blob object
      const url = URL.createObjectURL(blob);
      // Create a link element to download the CSV file
      const link = document.createElement("a");
      // Set the link's href attribute to the URL object
      link.href = url;
      // Set the link's download attribute to the file name
      link.setAttribute("download", "data-export.csv");
      document.body.appendChild(link);
      // Trigger a click event on the link element to download the CSV file
      link.click();
      // Clean up by removing the link element
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to export CSV:", err);
    }
  };

  // Calculate the paginated data
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Ensure currentPage is within bounds
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div className="px-24 py-8">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center mb-8">
        Data Review Table
      </h1>
      <div className="flex items-center mb-4">
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Filter by name..."
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            className="flex-grow"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center border-dashed"
              >
                <span className="mr-2">+</span>Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>
                Inactive
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                Pending
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button variant="outline" onClick={exportToCSV} className="ml-auto">
          Export CSV
        </Button>
      </div>
      <Table>
        <TableCaption>A list of records with validation errors.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Street</TableHead>
            <TableHead>City</TableHead>
            <TableHead className="text-right">Zipcode</TableHead>
            <TableHead className="text-right">Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Error Summary</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((record: Record) => (
            <TableRow key={record.id}>
              <TableCell className={getCellColor("name", record.errors)}>
                <Tooltip>
                  <TooltipTrigger>
                    <span>{record.name}</span>
                  </TooltipTrigger>
                  {record.errors?.name && (
                    <TooltipContent>
                      <p>{record.errors.name.message}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TableCell>

              <TableCell className={getCellColor("email", record.errors)}>
                <Tooltip>
                  <TooltipTrigger>
                    <span>{record.email}</span>
                  </TooltipTrigger>
                  {record.errors?.email && (
                    <TooltipContent>
                      <p>{record.errors.email.message}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TableCell>

              <TableCell className={getCellColor("street", record.errors)}>
                <Tooltip>
                  <TooltipTrigger>
                    <span>{record.street}</span>
                  </TooltipTrigger>
                  {record.errors?.street && (
                    <TooltipContent>
                      <p>{record.errors.street.message}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TableCell>

              <TableCell className={getCellColor("city", record.errors)}>
                <Tooltip>
                  <TooltipTrigger>
                    <span>{record.city}</span>
                  </TooltipTrigger>
                  {record.errors?.city && (
                    <TooltipContent>
                      <p>{record.errors.city.message}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TableCell>

              <TableCell
                className={`${getCellColor(
                  "zipcode",
                  record.errors
                )} text-right`}
              >
                <Tooltip>
                  <TooltipTrigger>
                    <span>{record.zipcode}</span>
                  </TooltipTrigger>
                  {record.errors?.zipcode && (
                    <TooltipContent>
                      <p>{record.errors.zipcode.message}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TableCell>

              <TableCell
                className={`${getCellColor("phone", record.errors)} text-right`}
              >
                <Tooltip>
                  <TooltipTrigger>
                    <span>{record.phone}</span>
                  </TooltipTrigger>
                  {record.errors?.phone && (
                    <TooltipContent>
                      <p>{record.errors.phone.message}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TableCell>
              <TableCell>{record.status}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => setModalData(record)}
                    >
                      View Errors
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Error Summary</DialogTitle>
                      <DialogDescription>
                        A summary of validation errors for this record.
                      </DialogDescription>
                    </DialogHeader>
                    {modalData &&
                      Object.entries(modalData.errors || {}).map(
                        ([field, error]) => (
                          <p key={field}>
                            <strong>{field}:</strong> {error.message} (
                            {error.severity})
                          </p>
                        )
                      )}
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between mt-4">
        {/* Rows per page selector */}
        <div className="flex items-center">
          <span>Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
            className="ml-2 p-1 border border-gray-300 rounded-md"
          >
            {[5, 10, 25, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span>
            Page {currentPage} of {Math.ceil(filteredData.length / rowsPerPage)}
          </span>
          <Button
            variant="outline"
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, Math.ceil(filteredData.length / rowsPerPage))
              )
            }
            disabled={
              currentPage === Math.ceil(filteredData.length / rowsPerPage)
            }
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
