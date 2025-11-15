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
      latitude: 39.99926,
      longitude: -83.01488,
      address: "William Oxley Thompson Memorial Library, 1858 Neil Ave Mall, Columbus, OH 43210"
    }
  },
  {
    id: "2",
    name: "Thompson Library: 2nd Floor Grand Reading Room",
    location: {
      latitude: 39.99926,
      longitude: -83.01488,
      address: "William Oxley Thompson Memorial Library, 1858 Neil Ave Mall, Columbus, OH 43210"
    }
  },
  {
    id: "3",
    name: "18th Avenue Library",
    location: {
      latitude: 40.00164,
      longitude: -83.01334,
      address: "175 West 18th Avenue, Columbus, OH 43210"
    }
  },
  {
    id: "4",
    name: "Smith Lab",
    location: {
      latitude: 40.00242,
      longitude: -83.01329,
      address: "174 W. 18th Avenue, Columbus, OH 43210"
    }
  },
  {
    id: "5",
    name: "Fontana Lab",
    location: {
      latitude: 40.00366,
      longitude: -83.01283,
      address: "Engineering complex on West 19th Avenue, Columbus, OH 43210"
    }
  },
  {
    id: "6",
    name: "Morrill Tower Study Rooms",
    location: {
      latitude: 39.99979,
      longitude: -83.02185,
      address: "Morrill Tower, 1900 Cannon Drive, Columbus, OH 43210"
    }
  },
  {
    id: "7",
    name: "Knowlton Hall: Architecture Library",
    location: {
      latitude: 40.00349,
      longitude: -83.01570,
      address: "Knowlton hall, 275 West Woodruff Avenue, Columbus, OH 43210"
    }
  },
  {
    id: "8",
    name: "Music Hall: Timashev Family Music Building",
    location: {
      latitude: 40.00089,
      longitude: -83.00998,
      address: "Timashev Family Music Building, 1900 College Road, Columbus, OH 43210"
    }
  },
  {
    id: "9",
    name: "Orton Hall: Geology Library",
    location: {
      latitude: 40.00133,
      longitude: -83.01456,
      address: "Orton Hall, 155 South Oval Mall, Columbus, OH 43210"
    }
  },
  // Dining Spots
  {
    id: "10",
    name: "Traditions at Scott",
    location: {
      latitude: 40.00405,
      longitude: -83.01179,
      address: "Scott House, 160 West Woodruff Avenue, Columbus, OH 43210"
    }
  },
  {
    id: "11",
    name: "Traditions at Kennedy Commons",
    location: {
      latitude: 39.99570,
      longitude: -83.01560,
      address: "Traditions at Kennedy, Kennedy Commons,251 West 12th Avenue, Columbus, OH 43210"
    }
  },
  {
    id: "12",
    name: "Traditions at Morrill",
    location: {
      latitude: 39.99979,
      longitude: -83.02185,
      address: "Traditions at Morrill, Morrill Tower, 1900 Cannon Drive, Columbus, OH 43210"
    }
  },
  {
    id: "13",
    name: "Juice at RPAC",
    location: {
      latitude: 39.99900,
      longitude: -83.01820,
      address: "RPAC(Recreation & Physical Activity Center) 337 West 17th Avenue, Columbus, OH 43210"
    }
  },
  {
    id: "14",
    name: "Berry Cafe",
    location: {
      latitude: 39.99926,
      longitude: -83.01488,
      address: "Ground floor, William Oxley Thompson Memorial Library, 1858 Neil Avenue mall, Columbus, OH 43210"
    }
  },
  {
    id: "15",
    name: "Curl Market",
    location: {
      latitude: 40.00436,
      longitude: -83.01094,
      address: "Curl Market, 80 West Woodruff Avenue, Columbus, OH 43210"
    }
  },
  {
    id: "16",
    name: "Connecting Grounds",
    location: {
      latitude: 40.00405,
      longitude: -83.01170,
      address: "Connecting grounds, 160 West Woodruff Avenue, Columbus, OH 43210"
    }
  },
  {
    id: "17",
    name: "Woody's Tavern",
    location: {
      latitude: 39.99930,
      longitude: -83.00870,
      address: "Woody's Tavern, The Ohio Union, 1739 North High Street, Columbus, OH 43210"
    }
  },
  {
    id: "18",
    name: "Sloopy's Diner",
    location: {
      latitude: 39.99930,
      longitude: -83.00870,
      address: "Sloopy's Diner, The Ohio Union, 1739 North High Street, Columbus, OH 43210"
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
