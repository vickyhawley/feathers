'use client';
import React, { useEffect, useState } from "react";
import { Heart } from "react-feather";

type FeatherState = {
  id: number;
  name: string;
  en_name: string;
  sex: string;
  age: number;
};

export default function FeatherPile() {
  const [allNames, setAllNames] = useState<any[]>([]);
  const [feathers, setFeathers] = useState<FeatherState[]>([]);
  const [landedCount, setLandedCount] = useState(0);
  const [page, setPage] = useState(0);
  const pageSize = 50;
  const [showRisingIcon, setShowRisingIcon] = useState(false);

  useEffect(() => {
    async function fetchAllNames() {
      const res = await fetch(
        "https://data.techforpalestine.org/api/v2/killed-in-gaza.json"
      );
      const data = await res.json();
      console.log('data', data)

      const childrenOnly = data.filter((person: any) => {
        const age = parseInt(person.age, 10);
        return !isNaN(age) && age <= 17;
      });
      setAllNames(childrenOnly);
      setPage(1); // trigger first render of 50
    }

    fetchAllNames();
  }, []);



  useEffect(() => {
    if (page === 0 || allNames.length === 0) return;

    const nextBatch = allNames.slice((page - 1) * pageSize, page * pageSize);

    const newFeathers: FeatherState[] = nextBatch.map((person, idx) => ({
      id: person.id ?? (page * pageSize + idx),
      name: person.name,
      sex: person.sex,
      age: person.age,
      en_name: person.en_name
    }));

    setFeathers(prev => [...prev, ...newFeathers]);

    if (page * pageSize >= allNames.length) {
      // all loaded, show heart after slight delay
      setTimeout(() => setShowRisingIcon(true), 1500);
    }
  }, [page, allNames]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 &&
        page * pageSize < allNames.length
      ) {
        setPage(prev => prev + 1);
      }
    };
  
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page, allNames]);
  

  useEffect(() => {
    if (landedCount === pageSize && page * pageSize < allNames.length) {
      // All feathers from current page landed; load next page
      setTimeout(() => {
        setPage(prev => prev + 1);
        setLandedCount(0); // reset for the next page
      }, 500); // small delay if desired
    }
  }, [landedCount]);
  

    return (
      <div style={{paddingLeft: 16, paddingRight: 16}}>
        <h1 style={{width: '70%', textAlign: 'center', marginLeft: 'auto', marginRight: 'auto'}}>
          The names of children who have died since October 7, 2023 for Gaza and the West Bank
          </h1>
      <div
        style={{
          minHeight: "100vh",
          background: "#111",
          padding: "2rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
          gap: "1rem",
          justifyItems: "center",
        }}
      >
        
        {feathers.map(({ id, name, en_name, sex, age }) => (
          <div
            key={id}
            style={{
              background: age <= 10 ? 'white' : "#222",
              borderRadius: "12px",
              padding: "1rem",
              width: "100%",
              justifyContent: 'space-between',
              border: "1px solid #333",
            }}
          >
            <p style={{color: sex === "m" ? "skyblue" : "hotpink",
              textAlign: "center",
              fontWeight: 600,
              fontSize: "0.9rem",marginBottom: 16}}>{name}</p>
              <p style={{color: sex === "m" ? "skyblue" : "hotpink",
              textAlign: "center",
              fontWeight: 200,
              fontSize: "0.9rem",marginBottom: 16}}>{en_name}</p>
            <p style={{color: sex === "m" ? "skyblue" : "hotpink",
              textAlign: "center",
              fontWeight: 600,
              fontSize: "0.9rem",}}>Age: {age}</p>
          </div>
        ))}
    
        {showRisingIcon && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", marginTop: "2rem" }}>
            <Heart size={80} color="#ff5a5f" />
          </div>
        )}
      </div>
      </div>
    );
}

