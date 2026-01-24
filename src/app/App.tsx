import type React from "react";
import { useEffect, useMemo, useState } from "react";

import logo from "../assets/wingslogo.png";
import familyIcon from "../assets/familyicon.png";
import allAgesIcon from "../assets/agesicon.png";
import heroImage1 from "../assets/hero/hero-1.jpg";
import heroImage2 from "../assets/hero/hero-2.jpg";
import heroImage3 from "../assets/hero/hero-3.jpg";
import galleryImage1 from "../assets/gallery/gallery-1.jpg";
import galleryImage2 from "../assets/gallery/gallery-2.jpg";
import galleryImage3 from "../assets/gallery/gallery-3.jpg";
import galleryImage4 from "../assets/gallery/gallery-4.jpg";
import catchCornerLogo from "../assets/logos/catchcorner.png";
import { HeroCarousel } from "@/app/components/HeroCarousel";
import { ImageCarousel } from "@/app/components/ImageCarousel";
import { InfoBox } from "@/app/components/InfoBox";
import { PriceCard } from "@/app/components/PriceCard";
import { ScheduleTable } from "@/app/components/ScheduleTable";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";
import { Volume2, Stars, Star } from "lucide-react";

export default function App() {
  const heroImages = [
    { url: heroImage3, alt: "Wings Arena seating area" },
    { url: heroImage1, alt: "Wings Arena ice rink facility" },
    { url: heroImage2, alt: "Wings Arena ice rink view" },
  ];

  const galleryImages = [
    { url: heroImage3, alt: "Wings Arena seating area" },
    { url: heroImage1, alt: "Wings Arena ice rink facility" },
    { url: heroImage2, alt: "Wings Arena ice rink view" },
    { url: galleryImage1, alt: "Family ice skating" },
    { url: galleryImage2, alt: "Children skating rink" },
    { url: galleryImage3, alt: "Ice hockey arena" },
    { url: galleryImage4, alt: "Skating lessons" },
  ];

  // Track breakpoints in JS so we can (a) scroll correctly and (b) remount schedule when layout changes.
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(min-width: 1024px)").matches
      : false
  );

  const [isUnder1000, setIsUnder1000] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 1000px)").matches
      : false
  );

  // ✅ Spotlight entrance: run once on mount, then remove
  const [showSpotlights, setShowSpotlights] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mqDesktop = window.matchMedia("(min-width: 1024px)");
    const mq1000 = window.matchMedia("(max-width: 1000px)");

    const onDesktopChange = () => setIsDesktop(mqDesktop.matches);
    const on1000Change = () => setIsUnder1000(mq1000.matches);

    // Safari fallback support
    if (mqDesktop.addEventListener)
      mqDesktop.addEventListener("change", onDesktopChange);
    else mqDesktop.addListener(onDesktopChange);

    if (mq1000.addEventListener)
      mq1000.addEventListener("change", on1000Change);
    else mq1000.addListener(on1000Change);

    // Initialize
    onDesktopChange();
    on1000Change();

    return () => {
      if (mqDesktop.removeEventListener)
        mqDesktop.removeEventListener("change", onDesktopChange);
      else mqDesktop.removeListener(onDesktopChange);

      if (mq1000.removeEventListener)
        mq1000.removeEventListener("change", on1000Change);
      else mq1000.removeListener(on1000Change);
    };
  }, []);

  // ✅ Spotlight entrance: turn off after animation completes
  useEffect(() => {
    const t = window.setTimeout(() => setShowSpotlights(false), 2400);
    return () => window.clearTimeout(t);
  }, []);

  // Remount ScheduleTable when the <=1000 layout mode changes
  const scheduleKey = useMemo(
    () => (isUnder1000 ? "schedule-under-1000" : "schedule-over-1000"),
    [isUnder1000]
  );

  const smoothScrollToEl = (el: HTMLElement, id?: string) => {
    if (id) {
      try {
        window.history.replaceState(null, "", `#${id}`);
      } catch {
        // ignore
      }
    }

    const offset = 12;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;

    window.requestAnimationFrame(() => {
      window.scrollTo({ top, behavior: "smooth" });
    });
  };

  const scrollToId =
    (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      const el = document.getElementById(id);
      if (!el) return;
      smoothScrollToEl(el, id);
    };

  const scrollToPricing = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetId = isDesktop ? "pricing-desktop" : "pricing-mobile";
    const el = document.getElementById(targetId);
    if (!el) return;
    smoothScrollToEl(el, targetId);
  };

  // ✅ One shadow token you can reuse everywhere (cards/images/buttons/schedule wrappers)
  const SHADOW = "shadow-[0_8px_20px_rgba(0,0,0,0.45)]";

  return (
    <div
      className={[
        "min-h-screen bg-[#392a7f] flex flex-col sm:block",
        "text-[#b7ff62] [&_*]:text-[#b7ff62]",
        "spotlight-stage",
        showSpotlights ? "spotlight-entrance" : "",
      ].join(" ")}
    >
      {/* ✅ Spotlight overlay */}
      <div className="spotlights" aria-hidden="true">
        <span className="beam b1"></span>
        <span className="beam b2"></span>
        <span className="beam b3"></span>
        <span className="beam b4"></span>
        <span className="beam b5"></span>
        <span className="beam b6"></span>
      </div>

      {/* Header */}
      <header className="bg-[#392a7f] border-b border-[#b2dbd7]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-8 py-4">
          <nav className="flex items-center justify-between"></nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-[#392a7f] border-b border-[#b2dbd7]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 xl:px-0 py-12">
          <div className="grid lg:grid-cols-2 gap-y-8 lg:gap-y-8 lg:gap-x-[162px] items-center">
            <div className="lg:-ml-[60px] min-[1001px]:max-[1325px]:ml-0 min-[1001px]:max-[1325px]:pr-5">
              {/* Center logo + header for all breakpoints <= ~1000px */}
              <div className="flex flex-col items-center lg:items-center mb-6">
                <img
                  src={logo}
                  alt="Wings Arena"
                  className={`w-[58.04px] mt-[-30px] -mb-[0px] ml-3 mr-3 lg:ml-[8px] min-[1001px]:max-[1325px]:ml-[28px]`}
                />
                <h1 className="text-4xl lg:text-5xl text-center lg:text-left min-[1001px]:max-[1325px]:pl-[28px]">
                  Cosmic Skate
                </h1>
                <div className="mt-[15px] -mb-[10px] h-px w-full bg-gradient-to-r from-transparent via-[#b2dbd7]/50 to-transparent" />
              </div>

              <div className="mb-4 ml-1 space-y-5 lg:text-center min-[1001px]:max-[1325px]:ml-[28px] text-[15px] sm:text-[16px] lg:text-[18px] leading-relaxed">
                <p>
                  Lights low, music up, and colorful effects that turn the rink
                  into a full-on party on ice. Pull up with friends, take a few
                  laps, hang out between songs, and settle into the vibe for the
                  whole session - Cosmic Skate is built for an easy, high-energy
                  night out that feels unique each time you skate. Bring your
                  crew and make it your new go-to weekend night out!
                </p>
                <p>
                  Rental Skates are INCLUDED during Cosmic Skates. We have a
                  wide variety of sizes available for all ages in both hockey
                  and figure skates.
                </p>

                <p>
                  Sign up for our{" "}
                  <a
                    href="https://wingsarena.us19.list-manage.com/subscribe?u=24f7d2c715354242b159d53fb&id=a4396cc1bd"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 hover:opacity-80 transition-opacity"
                  >
                    Newsletter
                  </a>{" "}
                  to receive Cosmic Skate updates as well as promo codes for
                  discounts and special rates!
                </p>
              </div>
            </div>

            <div
              className={`
                relative h-64 sm:h-80 lg:h-96
                ml-[0px] lg:ml-0
                min-[1001px]:max-[1325px]:h-[320px]
                min-[1001px]:max-[1325px]:ml-0
                min-[1001px]:max-[1325px]:scale-[0.93]
                min-[1001px]:max-[1325px]:origin-top-left
                ${SHADOW}
                rounded-lg overflow-hidden
              `}
            >
              <HeroCarousel images={heroImages} interval={3000} />
            </div>
          </div>
        </div>
      </section>

      <div className="max-[1000px]:flex max-[1000px]:flex-col">
        {/* Info Boxes */}
        <section className="max-w-[calc(80rem*0.97+200px)] mx-auto px-0 sm:px-6 xl:px-8 py-8 max-[1000px]:order-2 max-[1000px]:pt-0 max-[1000px]:-mt-[18px] lg:mt-[25px]">
          <div className="max-[640px]:w-[100vw] max-[640px]:ml-[calc(50%-50vw)] max-[640px]:px-3 max-[640px]:box-border">
            <div className="grid w-full grid-cols-2 lg:grid-cols-4 gap-x-[20px] gap-y-[calc(1rem*1.0356)] justify-items-stretch">
              <div className={`w-full [&>*]:!w-full [&>*]:${SHADOW}`}>
                <InfoBox
                  icon={Volume2}
                  title="Skate to the Beat"
                  description="Big hits, good vibes, and nonstop skating."
                  titleClassName="text-[16px] sm:text-[16px] text-[#b7ff62]"
                  descriptionClassName="text-[11px] sm:text-[13px] leading-tight text-[#b7ff62]"
                  iconOffset="-mt-[0px]"
                  textOffset="-mt-[3.5px]"
                />
              </div>

              <div className={`w-full [&>*]:!w-full [&>*]:${SHADOW}`}>
                <InfoBox
                  icon={Stars}
                  title="Light Up Your Night"
                  description="Neon Ice. All night."
                  titleClassName="text-[16px] sm:text-[16px] text-[#b7ff62]"
                  descriptionClassName="text-[11px] sm:text-[13px] leading-tight text-[#b7ff62]"
                  iconOffset="-mt-[6px]"
                  textOffset="-mt-[3.5px]"
                />
              </div>

              <div
                className={`w-full [&>*]:!w-full [&>*]:${SHADOW} [&_img]:[filter:brightness(0)_saturate(100%)_invert(89%)_sepia(31%)_saturate(682%)_hue-rotate(25deg)_brightness(106%)_contrast(107%)]`}
              >
                <InfoBox
                  iconImage={familyIcon}
                  title="Great for Families"
                  description="A fun outing for kids, teens, and parents"
                  iconSize="w-[28.6px] h-[28.6px]"
                  iconOffset="-mt-[5px]"
                  titleClassName="text-[16px] sm:text-[16px] text-[#b7ff62]"
                  descriptionClassName="text-[11px] sm:text-[13px] leading-tight text-[#b7ff62]"
                />
              </div>

              <div
                className={`w-full [&>*]:!w-full [&>*]:${SHADOW} [&_img]:[filter:brightness(0)_saturate(100%)_invert(89%)_sepia(31%)_saturate(682%)_hue-rotate(25deg)_brightness(106%)_contrast(107%)]`}
              >
                <InfoBox
                  iconImage={allAgesIcon}
                  title="All Ages Welcome"
                  description="Family-friendly environment for all"
                  iconSize="w-[35.35px] h-[35.35px]"
                  iconOffset="-mt-[10px]"
                  textOffset="-mt-[1.5px]"
                  titleClassName="text-[15px] sm:text-[16px] text-[#b7ff62]"
                  descriptionClassName="text-[11px] sm:text-[13px] leading-snug text-[#b7ff62]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Schedule Section */}
        <section
          id="schedule"
          className="bg-[#392a7f] py-12 max-[1000px]:order-1"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-8">
            <div className="flex flex-col gap-6 sm:gap-8 min-[1001px]:items-center">
              <div
                className={[
                  "order-1 w-full",
                  "max-[1000px]:-mt-[47px] max-[1000px]:mx-0",
                  "min-[1001px]:mx-auto",
                  "min-[1001px]:w-[clamp(760px,72vw,1240px)]",
                  "min-[1001px]:-mt-[30px]",
                ].join(" ")}
              >
                <h2 className="text-[1.50125rem] sm:text-4xl mb-7 mt-7 min-[1001px]:mb-11 text-center">
                  Upcoming Cosmic Skates
                </h2>
                <div className="mb-[20px] -mt-[12px] h-px w-full bg-gradient-to-r from-transparent via-[#b2dbd7]/50 to-transparent" />

                <div
                  className={`bg-gray-800 rounded-lg border border-gray-700 p-4 sm:p-6 w-full min-w-0 overflow-visible ${SHADOW}`}
                >
                  <ScheduleTable key={scheduleKey} />
                </div>
              </div>

              {/* Pricing Section - shows here on mobile, later on desktop */}
              <div className="order-2 lg:hidden mt-0">
                <h2
                  id="pricing-mobile"
                  className="text-[1.7rem] sm:text-[2.15625rem] mb-2 sm:mb-8 text-center mt-[0px] sm:mt-0"
                ></h2>

                <div
                  className="flex justify-center w-full"
                  style={{
                    ["--pc-w" as any]: "clamp(140px, 56vw, 163px)",
                    ["--pc-gap" as any]: "clamp(6px, 3vw, 28px)",
                    ["--pc-title" as any]: "clamp(14px, 2.2vw, 20px)",
                    ["--pc-price" as any]: "clamp(24px, 4.6vw, 42px)",
                    ["--pc-desc" as any]: "clamp(12px, 1.8vw, 14px)",
                    ["--pc-feat" as any]: "clamp(12px, 1.7vw, 14px)",
                  }}
                >
                  <div className="grid grid-flow-col items-stretch justify-center gap-x-[var(--pc-gap)] auto-cols-[clamp(132px,56vw,200px)] max-[450px]:auto-cols-[clamp(108px,46vw,150px)] min-[601px]:max-[1000px]:auto-cols-[clamp(220px,35vw,340px)]">
                    <div
                      className={`h-full flex [&>*]:h-full [&>*]:w-full [&>*]:mx-0 [&>*]:${SHADOW} [&_*]:!text-[#b7ff62]`}
                    >
                      <PriceCard
                        title="Admission"
                        price="$14"
                        description="Per person"
                      />
                    </div>

                    <div
                      className={`h-full flex [&>*]:h-full [&>*]:w-full [&>*]:mx-0 [&>*]:${SHADOW} [&_*]:!text-[#b7ff62]`}
                    >
                      <PriceCard
                        title="Skate Rental"
                        price="$6"
                        description="Per person"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* (cards section commented out in your original) */}
            </div>
          </div>
        </section>
      </div>

      {/* Pricing Section - shows here on desktop, hidden on mobile */}
      <section
        id="pricing-desktop"
        className="hidden lg:block max-w-7xl mx-auto px-4 sm:px-6 xl:px-8 py-20 lg:-mt-[75px]"
      >
        <h2 className="text-[2rem] sm:text-[2.15625rem] mb-1 text-center"></h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 max-w-[856px] mx-auto gap-8 sm:gap-12 lg:gap-[72px]">
          <div className={`[&>*]:${SHADOW} [&_*]:!text-[#b7ff62]`}>
            <PriceCard
              title="Admission | 13yrs & Older"
              price="$20"
              description="Per person"
              features={["Walk-ins welcome", "Rental Skates Included!"]}
            />
          </div>

          <div className={`[&>*]:${SHADOW} [&_*]:!text-[#b7ff62]`}>
            <PriceCard
              title="Admission | 12yrs & Under"
              price="$15"
              description="Per person"
              features={[
                "Hockey & Figure Skates",
                "Youth & Adult Sizes",
                "Exchange sizes anytime",
              ]}
            />
          </div>
        </div>
      </section>

      {/* Parties & Ice Bookings Section */}
      <section className="bg-[#392a7f] py-8 pb-4 sm:pb-12 -mt-[25px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-8">
          <h2 className="text-[1.5625rem] sm:text-[2.2625rem] mb-0 sm:mb-5 text-center">
            Parties & Ice Bookings
          </h2>
          <div className="my-5 h-px w-full bg-gradient-to-r from-transparent via-[#b2dbd7]/50 to-transparent" />

          <div className="grid grid-cols-1 sm:grid-cols-2 w-[90%] sm:w-full max-w-4xl lg:max-w-6xl xl:max-w-[72rem] mx-auto my-8 gap-8 sm:gap-12 lg:gap-[72px]">
            <div
              className={`bg-gray-800 rounded-lg border border-gray-700 p-[1.65375rem] text-center ${SHADOW}`}
            >
              <h3 className="text-[1.378125rem] sm:text-[1.65375rem] mb-4 -mt-[5px]">
                Birthday Parties
              </h3>

              <a
                href="https://www.wingsarena.com/events"
                className={`bg-[#3874c5] px-[3.85375rem] py-[1.126875rem] rounded-md hover:bg-[#8028b0] hover:scale-105 transition-all inline-block mb-4 font-bold ${SHADOW}`}
              >
                Learn More
              </a>

              <p className="text-[0.9646875rem] mt-1 font-bold leading-7">
                For birthday party inquiries email: jwanderlingh@wingsarena.com
              </p>
            </div>

            <div
              className={`bg-gray-800 rounded-lg border border-gray-700 p-[1.65375rem] text-center ${SHADOW}`}
            >
              <h3 className="text-[1.378125rem] sm:text-[1.65375rem] mb-4 -mt-[5px]">
                Private Ice Bookings
              </h3>

              <a
                href="https://www.catchcorner.com/facility-page/embedded/rental/wings-arena"
                target="_blank"
                rel="noopener noreferrer"
                className={`bg-[#8028b0] px-[2.35375rem] py-[0.526875rem] rounded-md hover:bg-[#9ccbc7] hover:scale-105 transition-all inline-block mt-[2px] ${SHADOW}`}
              >
                <img
                  src={catchCornerLogo}
                  alt="Book with CatchCorner"
                  className={`h-[2.075rem] sm:h-[2.81rem] rounded-md`}
                />
              </a>
              <p className="text-[0.9646875rem] mt-4 font-bold">
                Ice time, on your watch. Book your next skate now!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ Gallery Section (FIXED: no translate = no phantom space) */}
      <section
        className="
          max-w-6xl mx-auto px-4 sm:px-6 xl:px-8
          pt-10 pb-10
          -mt-[60px] sm:mt-0
          order-2 sm:order-none
        "
      >
        <h2 className="text-2xl sm:text-4xl mb-6 sm:mb-6 text-center">
          Gallery
        </h2>
        <div className="my-4 h-px w-full bg-gradient-to-r from-transparent via-[#b2dbd7]/50 to-transparent" />

        {/* ✅ iOS scroll fix: allow vertical pan even when touching the carousel */}
        <div className="rounded-lg overflow-hidden touch-pan-y">
          <ImageCarousel images={galleryImages} interval={3000} />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-[#392a7f] py-12 sm:py-12 pt-0 sm:pt-12 order-1 sm:order-none mt-[35px] sm:mt-0">
        <div className="max-w-[58.08rem] mx-auto px-4 sm:px-6 xl:px-8">
          <h2 className="text-2xl sm:text-3xl mb-4 sm:mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="my-4 h-px w-full bg-gradient-to-r from-transparent via-[#b2dbd7]/50 to-transparent" />

          <Accordion
            type="single"
            collapsible
            className={`bg-[#b4fd5a] rounded-lg border border-gray-700 px-4 sm:px-6 ${SHADOW} [&_*]:!text-[#1e2a3a]`}
          >
            <AccordionItem value="item-1">
              <AccordionTrigger>Do I need to bring my own skates?</AccordionTrigger>
              <AccordionContent>
                No, skate rentals are available and are included with admission
                during Cosmic Skates. We have sizes for all ages, from toddlers
                to adults. However, you're welcome to bring your own skates if
                you prefer.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>What should I wear to Cosmic Skate?</AccordionTrigger>
              <AccordionContent>
                We recommend wearing comfortable, warm clothing that allows for
                movement. Long pants are recommended, and layers are ideal as
                the rink temperature is kept cool. Gloves or mittens are
                encouraged for hand protection, and helmets are strongly
                recommended for all skaters regardless of ability.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Are skating aids available for beginners?</AccordionTrigger>
              <AccordionContent>
                Yes, we have skating aids available to help beginners learn to
                skate (limited quantity). These are especially helpful for young
                children and first-time skaters. Staff members are also
                available to provide basic guidance.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Can I book a birthday party or group event?</AccordionTrigger>
              <AccordionContent>
                Absolutely! We host birthday parties and group event bookings.
                This includes your choice of private or public skating time
                (rates vary), as well as party room rental. For more info and
                availability, email our Events Coordinator, Joe -{" "}
                jwanderlingh@wingsarena.com
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </div>
  );
}
