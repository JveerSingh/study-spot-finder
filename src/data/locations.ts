export interface SpotLocation {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

export const locations: SpotLocation[] = [
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
