import 'dotenv/config';
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

if (!url || !serviceKey) {
  console.error("Missing Supabase env (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)");
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

type Biz = {
  name: string;
  description?: string;
  category: string;
  phone?: string;
  website?: string;
  city: string;
  state?: string;
  country: string;
  latitude: number;
  longitude: number;
  photo?: string;
};

const businesses: Biz[] = [
  // Restaurants
  { name: "Amala Sky Lagos", description: "Authentic Amala and Ewedu.", category: "Restaurant", phone: "+234 813 555 1001", website: "https://example.ng/amalasky", city: "Lagos", state: "Lagos", country: "Nigeria", latitude: 6.5244, longitude: 3.3792, photo: "https://images.pexels.com/photos/33523254/pexels-photo-33523254.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { name: "Mama Put Corner", description: "Local dishes, fresh daily.", category: "Restaurant", phone: "+234 806 222 3102", website: "https://example.ng/mamaput", city: "Lagos", state: "Lagos", country: "Nigeria", latitude: 6.5300, longitude: 3.3700, photo: "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { name: "Jollof Express", description: "Party jollof specialist.", category: "Restaurant", phone: "+234 705 444 2103", website: "https://example.ng/jollofexpress", city: "Lagos", state: "Lagos", country: "Nigeria", latitude: 6.5200, longitude: 3.3900, photo: "https://images.pexels.com/photos/2092516/pexels-photo-2092516.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { name: "Suya Masters Ikeja", description: "Spicy suya at night.", category: "Restaurant", phone: "+234 901 222 4104", website: "https://example.ng/suyamasters", city: "Lagos", state: "Lagos", country: "Nigeria", latitude: 6.6000, longitude: 3.3500, photo: "https://images.pexels.com/photos/616377/pexels-photo-616377.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { name: "Chop Bar Accra", description: "Waakye and kelewele.", category: "Restaurant", phone: "+233 201 234 567", website: "https://example.gh/chopbar", city: "Accra", state: "Greater Accra", country: "Ghana", latitude: 5.6037, longitude: -0.1870, photo: "https://images.pexels.com/photos/9095/food-dinner-pasta-spaghetti-9095.jpg?auto=compress&cs=tinysrgb&w=800" },

  // Salons/Beauty
  { name: "Kemi's Beauty Lounge", description: "Braids, nails, and spa.", category: "Salon", phone: "+234 802 777 1201", website: "https://example.ng/kemisbeauty", city: "Abuja", state: "FCT", country: "Nigeria", latitude: 9.0765, longitude: 7.3986, photo: "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { name: "Wuse Cuts", description: "Classic barber shop.", category: "Salon", phone: "+234 810 233 1202", website: "https://example.ng/wusecuts", city: "Abuja", state: "FCT", country: "Nigeria", latitude: 9.0700, longitude: 7.4200, photo: "https://images.pexels.com/photos/3998429/pexels-photo-3998429.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { name: "Aso Rock Glow", description: "Makeup and makeover studio.", category: "Salon", phone: "+234 813 900 1203", website: "https://example.ng/asorockglow", city: "Abuja", state: "FCT", country: "Nigeria", latitude: 9.0600, longitude: 7.4100, photo: "https://images.pexels.com/photos/3992873/pexels-photo-3992873.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { name: "Garki Groomers", description: "Premium male grooming.", category: "Salon", phone: "+234 815 100 1204", website: "https://example.ng/garkigroomers", city: "Abuja", state: "FCT", country: "Nigeria", latitude: 9.0500, longitude: 7.4000, photo: "https://images.pexels.com/photos/3998412/pexels-photo-3998412.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { name: "Westlands Glow", description: "Protective styles and treatments.", category: "Salon", phone: "+254 700 555 1205", website: "https://example.ke/westlandsglow", city: "Nairobi", state: "Nairobi", country: "Kenya", latitude: -1.2921, longitude: 36.8219, photo: "https://images.pexels.com/photos/3993443/pexels-photo-3993443.jpeg?auto=compress&cs=tinysrgb&w=800" },

  // Pharmacies/Health
  { name: "Chukwuemeka Pharma", description: "24/7 pharmacy and consultation.", category: "Pharmacy", phone: "+234 803 111 1301", website: "https://example.ng/chukwuemekapharma", city: "Port Harcourt", state: "Rivers", country: "Nigeria", latitude: 4.8156, longitude: 7.0498, photo: "https://images.pexels.com/photos/8460150/pexels-photo-8460150.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { name: "Garden City Meds", description: "Reliable prescriptions.", category: "Pharmacy", phone: "+234 806 222 1302", website: "https://example.ng/gardencitymeds", city: "Port Harcourt", state: "Rivers", country: "Nigeria", latitude: 4.8200, longitude: 7.0600, photo: "https://images.pexels.com/photos/4021773/pexels-photo-4021773.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { name: "Bonny Island Chemist", description: "Community pharmacy.", category: "Pharmacy", phone: "+234 812 300 1303", website: "https://example.ng/bonnychemist", city: "Port Harcourt", state: "Rivers", country: "Nigeria", latitude: 4.8300, longitude: 7.0300, photo: "https://images.pexels.com/photos/205926/pexels-photo-205926.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { name: "New GRA Pharmacy", description: "Vaccines and health checks.", category: "Pharmacy", phone: "+234 705 777 1304", website: "https://example.ng/newgraphrm", city: "Port Harcourt", state: "Rivers", country: "Nigeria", latitude: 4.8100, longitude: 7.0700, photo: "https://images.pexels.com/photos/45861/pexels-photo-45861.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { name: "Sandton Health Hub", description: "OTC and personal care.", category: "Pharmacy", phone: "+27 82 000 1305", website: "https://example.za/sandtonhealth", city: "Johannesburg", state: "Gauteng", country: "South Africa", latitude: -26.1076, longitude: 28.0567, photo: "https://images.pexels.com/photos/3938022/pexels-photo-3938022.jpeg?auto=compress&cs=tinysrgb&w=800" },

  // Mechanics/Auto
  { name: "Sabo Auto Works", description: "Diagnostics and repairs.", category: "Mechanic", phone: "+234 802 555 1401", website: "https://example.ng/saboauto", city: "Kano", state: "Kano", country: "Nigeria", latitude: 12.0022, longitude: 8.5919, photo: "https://images.pexels.com/photos/4488661/pexels-photo-4488661.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { name: "Unguwa Service Center", description: "Fast oil change.", category: "Mechanic", phone: "+234 810 777 1402", website: "https://example.ng/unguwaservice", city: "Kano", state: "Kano", country: "Nigeria", latitude: 12.0100, longitude: 8.5600, photo: "https://images.pexels.com/photos/3806249/pexels-photo-3806249.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { name: "Yusuf Motors", description: "Bodywork and spray.", category: "Mechanic", phone: "+234 815 300 1403", website: "https://example.ng/yusufmotors", city: "Kano", state: "Kano", country: "Nigeria", latitude: 12.0200, longitude: 8.6000, photo: "https://images.pexels.com/photos/6870320/pexels-photo-6870320.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { name: "Sabon Gari AutoFix", description: "Electrical specialists.", category: "Mechanic", phone: "+234 813 200 1404", website: "https://example.ng/sabongariautofix", city: "Kano", state: "Kano", country: "Nigeria", latitude: 12.0300, longitude: 8.5800, photo: "https://images.pexels.com/photos/8985492/pexels-photo-8985492.jpeg?auto=compress&cs=tinysrgb&w=800" },
  { name: "Nyamirambo Auto Care", description: "Tyres and alignment.", category: "Mechanic", phone: "+250 788 000 1405", website: "https://example.rw/nyamirambo", city: "Kigali", state: "Kigali", country: "Rwanda", latitude: -1.9579, longitude: 30.1127, photo: "https://images.pexels.com/photos/3807331/pexels-photo-3807331.jpeg?auto=compress&cs=tinysrgb&w=800" },
];

async function run() {
  // Get current user id for owner mapping (optional). We'll set owner_id null and rely on policies for inserts via signed-in users.
  // For demo, allow null owner_id by inserting with service key and then updating to anon user where available is not straightforward.

  for (const b of businesses) {
    const { data: inserted, error } = await supabase
      .from("businesses")
      .insert({
        name: b.name,
        description: b.description ?? null,
        category: b.category,
        phone: b.phone ?? null,
        website: b.website ?? null,
        address_line1: null,
        address_line2: null,
        city: b.city,
        state: b.state ?? null,
        postal_code: null,
        country: b.country,
        latitude: b.latitude,
        longitude: b.longitude,
        owner_id: (null as any),
      })
      .select("id")
      .single();
    if (error) {
      console.error("Insert business failed", b.name, error.message);
      continue;
    }
    const bizId = inserted?.id as string;
    if (b.photo) {
      await supabase.from("photos").insert({ business_id: bizId, url: b.photo, caption: b.name });
    }
    await supabase.from("reviews").insert([
      { business_id: bizId, rating: 5, comment: "Very okay, I enjoyed it well.", author_name: "Chinedu" },
      { business_id: bizId, rating: 4, comment: "Service make sense, price fair.", author_name: "Aisha" },
    ]);
  }
}

run().then(() => {
  console.log("Seeded 20 businesses to Supabase");
  process.exit(0);
}).catch((e) => {
  console.error(e);
  process.exit(1);
});


