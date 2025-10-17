import prisma from "../src/lib/prisma";

async function main() {
  const owner = await prisma.user.upsert({
    where: { email: "adeola@bizdemo.ng" },
    update: {},
    create: {
      email: "adeola@bizdemo.ng",
      name: "Adeola Adebayo",
      password: "demo-hash",
    },
  });

  // 20 African businesses across 4 categories (5 each) in varied cities
  const businesses = [
    // Restaurants (Lagos, Accra)
    { name: "Amala Sky Lagos", description: "Authentic Amala and Ewedu.", category: "Restaurant", phone: "+234 813 555 1001", website: "https://example.ng/amalasky", city: "Lagos", state: "Lagos", country: "Nigeria", latitude: 6.5244, longitude: 3.3792 },
    { name: "Mama Put Corner", description: "Local dishes, fresh daily.", category: "Restaurant", phone: "+234 806 222 3102", website: "https://example.ng/mamaput", city: "Lagos", state: "Lagos", country: "Nigeria", latitude: 6.5300, longitude: 3.3700 },
    { name: "Jollof Express", description: "Party jollof specialist.", category: "Restaurant", phone: "+234 705 444 2103", website: "https://example.ng/jollofexpress", city: "Lagos", state: "Lagos", country: "Nigeria", latitude: 6.5200, longitude: 3.3900 },
    { name: "Suya Masters Ikeja", description: "Spicy suya at night.", category: "Restaurant", phone: "+234 901 222 4104", website: "https://example.ng/suyamasters", city: "Lagos", state: "Lagos", country: "Nigeria", latitude: 6.6000, longitude: 3.3500 },
    { name: "Chop Bar Accra", description: "Waakye and kelewele.", category: "Restaurant", phone: "+233 201 234 567", website: "https://example.gh/chopbar", city: "Accra", state: "Greater Accra", country: "Ghana", latitude: 5.6037, longitude: -0.1870 },

    // Salons (Abuja, Nairobi)
    { name: "Kemi's Beauty Lounge", description: "Braids, nails, and spa.", category: "Salon", phone: "+234 802 777 1201", website: "https://example.ng/kemisbeauty", city: "Abuja", state: "FCT", country: "Nigeria", latitude: 9.0765, longitude: 7.3986 },
    { name: "Wuse Cuts", description: "Classic barber shop.", category: "Salon", phone: "+234 810 233 1202", website: "https://example.ng/wusecuts", city: "Abuja", state: "FCT", country: "Nigeria", latitude: 9.0700, longitude: 7.4200 },
    { name: "Aso Rock Glow", description: "Makeup and makeover studio.", category: "Salon", phone: "+234 813 900 1203", website: "https://example.ng/asorockglow", city: "Abuja", state: "FCT", country: "Nigeria", latitude: 9.0600, longitude: 7.4100 },
    { name: "Garki Groomers", description: "Premium male grooming.", category: "Salon", phone: "+234 815 100 1204", website: "https://example.ng/garkigroomers", city: "Abuja", state: "FCT", country: "Nigeria", latitude: 9.0500, longitude: 7.4000 },
    { name: "Westlands Glow", description: "Protective styles and treatments.", category: "Salon", phone: "+254 700 555 1205", website: "https://example.ke/westlandsglow", city: "Nairobi", state: "Nairobi", country: "Kenya", latitude: -1.2921, longitude: 36.8219 },

    // Pharmacies (Port Harcourt, Johannesburg)
    { name: "Chukwuemeka Pharma", description: "24/7 pharmacy and consultation.", category: "Pharmacy", phone: "+234 803 111 1301", website: "https://example.ng/chukwuemekapharma", city: "Port Harcourt", state: "Rivers", country: "Nigeria", latitude: 4.8156, longitude: 7.0498 },
    { name: "Garden City Meds", description: "Reliable prescriptions.", category: "Pharmacy", phone: "+234 806 222 1302", website: "https://example.ng/gardencitymeds", city: "Port Harcourt", state: "Rivers", country: "Nigeria", latitude: 4.8200, longitude: 7.0600 },
    { name: "Bonny Island Chemist", description: "Community pharmacy.", category: "Pharmacy", phone: "+234 812 300 1303", website: "https://example.ng/bonnychemist", city: "Port Harcourt", state: "Rivers", country: "Nigeria", latitude: 4.8300, longitude: 7.0300 },
    { name: "New GRA Pharmacy", description: "Vaccines and health checks.", category: "Pharmacy", phone: "+234 705 777 1304", website: "https://example.ng/newgraphrm", city: "Port Harcourt", state: "Rivers", country: "Nigeria", latitude: 4.8100, longitude: 7.0700 },
    { name: "Sandton Health Hub", description: "OTC and personal care.", category: "Pharmacy", phone: "+27 82 000 1305", website: "https://example.za/sandtonhealth", city: "Johannesburg", state: "Gauteng", country: "South Africa", latitude: -26.1076, longitude: 28.0567 },

    // Mechanics (Kano, Kigali)
    { name: "Sabo Auto Works", description: "Diagnostics and repairs.", category: "Mechanic", phone: "+234 802 555 1401", website: "https://example.ng/saboauto", city: "Kano", state: "Kano", country: "Nigeria", latitude: 12.0022, longitude: 8.5919 },
    { name: "Unguwa Service Center", description: "Fast oil change.", category: "Mechanic", phone: "+234 810 777 1402", website: "https://example.ng/unguwaservice", city: "Kano", state: "Kano", country: "Nigeria", latitude: 12.0100, longitude: 8.5600 },
    { name: "Yusuf Motors", description: "Bodywork and spray.", category: "Mechanic", phone: "+234 815 300 1403", website: "https://example.ng/yusufmotors", city: "Kano", state: "Kano", country: "Nigeria", latitude: 12.0200, longitude: 8.6000 },
    { name: "Sabon Gari AutoFix", description: "Electrical specialists.", category: "Mechanic", phone: "+234 813 200 1404", website: "https://example.ng/sabongariautofix", city: "Kano", state: "Kano", country: "Nigeria", latitude: 12.0300, longitude: 8.5800 },
    { name: "Nyamirambo Auto Care", description: "Tyres and alignment.", category: "Mechanic", phone: "+250 788 000 1405", website: "https://example.rw/nyamirambo", city: "Kigali", state: "Kigali", country: "Rwanda", latitude: -1.9579, longitude: 30.1127 },
  ];

  for (const b of businesses) {
    const biz = await prisma.business.create({
      data: { ...b, ownerId: owner.id },
    });
    await prisma.photo.create({
      data: {
        businessId: biz.id,
        url: "https://picsum.photos/seed/" + encodeURIComponent(biz.name) + "/300/300",
        caption: biz.name,
      },
    });
    await prisma.review.createMany({
      data: [
        { businessId: biz.id, rating: 5, comment: "Very okay, I enjoyed it well.", authorName: "Chinedu" },
        { businessId: biz.id, rating: 4, comment: "Service make sense, price fair.", authorName: "Aisha" },
        { businessId: biz.id, rating: 4, comment: "I go come back again.", authorName: "Tolu" },
      ],
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });


