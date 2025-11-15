import { Location } from "@/components/LocationCard";

export interface SpotLocation {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

export const spotLocations: SpotLocation[] = [
  // Study Spots
  {
    id: "1",
    name: "Thompson Library: 11th Floor",
    location: {
      latitude: 40.0067,
      longitude: -83.0298,
      address: "1858 Neil Avenue Mall, Columbus, OH 43210"
    }
  },
  {
    id: "2",
    name: "Thompson Library: 2nd Floor Grand Reading Room",
    location: {
      latitude: 40.0067,
      longitude: -83.0298,
      address: "1858 Neil Avenue Mall, Columbus, OH 43210"
    }
  },
  {
    id: "3",
    name: "18th Avenue Library",
    location: {
      latitude: 40.0080,
      longitude: -83.0270,
      address: "175 West 18th Avenue, Columbus, OH 43210"
    }
  },
  {
    id: "4",
    name: "Smith Lab",
    location: {
      latitude: 40.0074,
      longitude: -83.0305,
      address: "174 W. 18th Avenue, Columbus, OH 43210"
    }
  },
  {
    id: "5",
    name: "Fontana Lab",
    location: {
      latitude: 40.0088,
      longitude: -83.0292,
      address: "116 W. 19th Avenue, Columbus, OH 43210"
    }
  },
  {
    id: "6",
    name: "Morrill Tower Study Rooms",
    location: {
      latitude: 40.0005,
      longitude: -83.0207,
      address: "2009 Millikin Road, Columbus, OH 43210"
    }
  },
  {
    id: "7",
    name: "Knowlton Hall: Architecture Library",
    location: {
      latitude: 40.0014,
      longitude: -83.0318,
      address: "275 W. Woodruff Avenue, Columbus, OH 43210"
    }
  },
  {
    id: "8",
    name: "Music Hall: Timashev Family Music Building",
    location: {
      latitude: 40.0078,
      longitude: -83.0285,
      address: "110 Weigel Hall, Columbus, OH 43210"
    }
  },
  {
    id: "9",
    name: "Orton Hall: Geology Library",
    location: {
      latitude: 40.0070,
      longitude: -83.0305,
      address: "155 S. Oval Mall, Columbus, OH 43210"
    }
  },
  // Dining Spots
  {
    id: "10",
    name: "Traditions at Scott",
    location: {
      latitude: 40.0095,
      longitude: -83.0245,
      address: "1989 College Road, Columbus, OH 43210"
    }
  },
  {
    id: "11",
    name: "Traditions at Kennedy Commons",
    location: {
      latitude: 40.0078,
      longitude: -83.0230,
      address: "1520 Neil Avenue, Columbus, OH 43210"
    }
  },
  {
    id: "12",
    name: "Traditions at Morrill",
    location: {
      latitude: 40.0005,
      longitude: -83.0207,
      address: "2009 Millikin Road, Columbus, OH 43210"
    }
  },
  {
    id: "13",
    name: "Juice at RPAC",
    location: {
      latitude: 39.9990,
      longitude: -83.0265,
      address: "337 Annie & John Glenn Avenue, Columbus, OH 43210"
    }
  },
  {
    id: "14",
    name: "Berry Cafe",
    location: {
      latitude: 40.0060,
      longitude: -83.0310,
      address: "1753 Neil Avenue, Columbus, OH 43210"
    }
  },
  {
    id: "15",
    name: "Curl Market",
    location: {
      latitude: 40.0085,
      longitude: -83.0250,
      address: "1863 Cannon Drive, Columbus, OH 43210"
    }
  },
  {
    id: "16",
    name: "Connecting Grounds",
    location: {
      latitude: 40.0020,
      longitude: -83.0290,
      address: "1739 N High Street, Columbus, OH 43210"
    }
  },
  {
    id: "17",
    name: "Woody's Tavern",
    location: {
      latitude: 40.0020,
      longitude: -83.0290,
      address: "1739 N High Street, Columbus, OH 43210"
    }
  },
  {
    id: "18",
    name: "Sloopy's Diner",
    location: {
      latitude: 40.0020,
      longitude: -83.0290,
      address: "1739 N High Street, Columbus, OH 43210"
    }
  }
];

// Transform spotLocations to Location objects with dynamic data
export const getLocations = (): Location[] => {
  return spotLocations.map((spot) => {
    // Determine if it's a dining spot or study spot based on the name
    const isDining = spot.name.includes("Traditions") || 
                    spot.name.includes("Juice") || 
                    spot.name.includes("Cafe") || 
                    spot.name.includes("Market") || 
                    spot.name.includes("Grounds") || 
                    spot.name.includes("Tavern") || 
                    spot.name.includes("Diner");
    
    // Extract building name (first part before colon or full name)
    const building = spot.name.includes(":") 
      ? spot.name.split(":")[0].trim() 
      : spot.name;
    
    // Extract floor/location (second part after colon or default)
    const floor = spot.name.includes(":") 
      ? spot.name.split(":")[1].trim() 
      : isDining ? "Dining Hall" : "Main Floor";
    
    // Generate realistic dynamic occupancy (between 25-90%)
    const occupancy = 25 + Math.floor(Math.random() * 65);
    
    // Determine noise level based on type and occupancy
    let noiseLevel: "silent" | "quiet" | "moderate" | "loud";
    if (isDining) {
      noiseLevel = occupancy > 70 ? "loud" : "moderate";
    } else {
      if (occupancy < 40) noiseLevel = "silent";
      else if (occupancy < 70) noiseLevel = "quiet";
      else noiseLevel = "moderate";
    }
    
    // Calculate available seats based on occupancy
    const totalSeats = isDining 
      ? (spot.name.includes("Traditions") ? 300 : 50)
      : (spot.name.includes("Thompson") ? 150 : 60);
    const availableSeats = Math.floor(totalSeats * (1 - occupancy / 100));
    
    return {
      id: spot.id,
      name: spot.name,
      building,
      floor,
      occupancy,
      noiseLevel,
      lastUpdated: `${Math.floor(Math.random() * 10) + 1} min ago`,
      availableSeats,
      coordinates: [spot.location.longitude, spot.location.latitude] as [number, number],
      type: isDining ? "dining" : "study"
    };
  });
};
