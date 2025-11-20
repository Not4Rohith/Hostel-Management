// This simulates a database response
export const MOCK_USER_DATA = {
  id: 'std_001',
  name: 'Rohith',
  email: 'rohith@college.edu',
  phone: '+91 98765 43210',
  course: 'B.Tech - CS (3rd Sem)',
  
  // Hostel Info
  roomNumber: '302',
  block: 'A-Block',
  bedId: 'B-1',
  
  // Guardian Info (Critical for Hostel Apps)
  guardianName: 'Mr. Sharma',
  guardianPhone: '+91 99887 76655',
  bloodGroup: 'O+',
  
  feesPending: 5000,
  profileImage: 'https://i.pravatar.cc/300', // Random avatar generator
  
  complaints: [] // ... existing complaints
};

// A fake function that acts like an API call
export const fetchStudentData = async () => {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_USER_DATA);
    }, 1000);
  });
};

// ... existing MOCK_USER_DATA ...

export const MOCK_COMPLAINTS = [
  { id: 1, title: 'Fan making noise', category: 'Electrical', status: 'Pending', date: '2025-11-19' },
  { id: 2, title: 'Bathroom tap leaking', category: 'Plumbing', status: 'Resolved', date: '2025-11-10' },
  { id: 3, title: 'Window glass broken', category: 'Carpentry', status: 'Resolved', date: '2025-10-25' },
];

// Simulate fetching complaints
export const fetchComplaints = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...MOCK_COMPLAINTS]), 800);
  });
};

// Simulate adding a complaint
export const submitComplaint = async (newComplaint: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Submitted to server:", newComplaint);
      resolve(true);
    }, 1000);
  });
};

// ... existing exports

export const MOCK_MENU = {
  'Mon': {
    Breakfast: { item: 'Idli & Vada', time: '7:30 - 9:00 AM' },
    Lunch: { item: 'Rice, Sambar, Potato Fry', time: '12:30 - 2:00 PM' },
    Snacks: { item: 'Tea & Biscuits', time: '4:30 - 5:30 PM' },
    Dinner: { item: 'Chapati & Veg Curry', time: '7:30 - 9:00 PM' }
  },
  'Tue': {
    Breakfast: { item: 'Dosa & Chutney', time: '7:30 - 9:00 AM' },
    Lunch: { item: 'Lemon Rice & Curd', time: '12:30 - 2:00 PM' },
    Snacks: { item: 'Coffee & Samosa', time: '4:30 - 5:30 PM' },
    Dinner: { item: 'Rice & Dal Tadka', time: '7:30 - 9:00 PM' }
  },
  'Wed': {
    Breakfast: { item: 'Pongal', time: '7:30 - 9:00 AM' },
    Lunch: { item: 'Veg Biryani & Raita', time: '12:30 - 2:00 PM' },
    Snacks: { item: 'Badam Milk', time: '4:30 - 5:30 PM' },
    Dinner: { item: 'Egg Curry / Paneer Butter Masala', time: '7:30 - 9:00 PM' }
  },
  // ... You can add Thu-Sun later
};

export const fetchMenu = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_MENU), 500);
  });
};

// ... existing exports

export const MOCK_LOST_FOUND_DATA = [
  { id: '1', item: 'Blue Umbrella', location: 'Mess Hall', contact: 'Room 302', type: 'FOUND', date: '2025-11-18' },
  { id: '2', item: 'Casio Calculator', location: 'Library', contact: 'Room 104', type: 'LOST', date: '2025-11-19' },
];

// Simulate adding an item
export const submitLostFoundItem = async (newItem: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("New Item Posted:", newItem);
      resolve(true);
    }, 1000);
  });
};



// --- ADMIN ROOM DATA ---

export const MOCK_ROOMS = Array.from({ length: 20 }, (_, i) => {
  const roomNo = (100 + i).toString();
  // Randomly fill rooms for demo
  const filled = Math.floor(Math.random() * 4); // 0 to 3 students
  const occupants = Array.from({ length: filled }, (_, j) => ({
    name: `Student ${roomNo}-${j+1}`,
    rollNo: `CS25${roomNo}${j}`,
    bed: String.fromCharCode(65 + j), // Bed A, B, C
    phone: '9876543210'
  }));

  return {
    roomNo,
    capacity: 3,
    occupants, // Array of students
    status: filled === 3 ? 'FULL' : 'AVAILABLE'
  };
});

export const fetchRooms = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_ROOMS), 500);
  });
};