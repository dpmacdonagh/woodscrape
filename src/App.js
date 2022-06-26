import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://wexdmnfxzybvownkqdma.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndleGRtbmZ4enlidm93bmtxZG1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTQ2MzE0MDAsImV4cCI6MTk3MDIwNzQwMH0.dcCw9rmfO972ksmEzOwM0Hm15N23DWup72qruQ5iRxY"
);

const columns = [
  {
    name: "ID",
    selector: (row) => row.id,
  },
  {
    name: "Name",
    selector: (row) => row.name,
  },
  {
    name: "IMG",
    selector: (row) => row.img_src,
    cell: (row) => <img src={row.img_src} style={{ width: 'auto', height: '100px'}} />
  },
  {
    name: "Purchases",
    selector: (row) => row.purchases,
    sortable: true,
  },
  {
    name: "Price",
    selector: (row) => row.price,
    sortable: true,
  },
  {
    name: "Rating",
    selector: (row) => row.rating,
    sortable: true,
  },
  {
    name: "HREF",
    selector: (row) => row.href,
    cell: (row) => <a href={row.href} target="_blank">Link</a>
  },
];

function MyComponent() {
  const [data, setData] = useState([]);
  const getData = async () => {
    let { data, error } = await supabase.from("items").select("*");
    setData(data);
  };
  useEffect(() => {
    getData();
  }, []);
  return <DataTable columns={columns} data={data} />;
}

export default MyComponent;
