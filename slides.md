---
title: "A prezentáció címe"
routerMode: hash
---

<!-- Címlap: írd át az alábbi mintaszövegeket a saját prezentációdhoz. -->
<div class="absolute inset-0 flex flex-col font-sans">
  <div class="w-full h-1/2 bg-[#1a2a5a] flex items-start justify-center pt-24 relative">
    <h1 class="text-6xl font-bold text-white tracking-wide z-10 m-0 border-none text-center px-12">
      <strong>A prezentáció címe</strong>
    </h1>
  </div>
  <div class="w-full h-1/2 bg-white flex flex-col items-center justify-start pt-24 relative text-[#1a2a5a]">
    <p class="text-lg opacity-90 mt-8">[Kurzus, tantárgy vagy alkalom – opcionális]</p>
    <p class="text-3xl font-bold mt-3 mb-1 text-center px-10">[Előadó neve]</p>
    <p class="text-lg mt-2">[Szak / tanszék / szervezeti egység – opcionális]</p>
    <p class="text-xl mt-4 opacity-80 m-0 font-bold">[Dátum]</p>
  </div>
  <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center z-20 w-full pointer-events-none">
    <img src="/assets/ekke-logo-cover.png" class="w-[34rem] max-w-[76%] h-auto object-contain" alt="Eszterházy Károly Katolikus Egyetem" />
  </div>
</div>

---

::header::
Háttér és kiindulópont
::default::

<div class="grid grid-cols-2 gap-8 items-center h-full">
  <div class="space-y-5">
    <h2 class="text-2xl font-bold">Miért ezzel a témával foglalkozom?</h2>
    <p class="text-lg opacity-85">Mutasd be röviden a témát, a gyakorlati igényt vagy a kérdést, amelyre a prezentáció választ ad.</p>
    <div class="border-l-4 border-[#c8a048] pl-4 py-2">
      <p class="text-xl font-semibold">Fő kérdés</p>
      <p class="opacity-80">[A téma központi kérdése vagy üzenete egy mondatban]</p>
    </div>
  </div>
  <div class="rounded-xl border border-[#1a2a5a]/15 bg-[#1a2a5a]/5 p-8">
    <div class="text-sm uppercase tracking-widest text-[#c8a048] font-bold mb-3">Háttér</div>
    <ul class="list-disc pl-5 space-y-3 text-lg">
      <li>[Első fontos körülmény]</li>
      <li>[Második fontos körülmény]</li>
      <li>[Miért érdemes foglalkozni vele?]</li>
    </ul>
  </div>
</div>

---

::header::
Célok és szempontok
::default::

<div class="space-y-5 mt-4">
  <p class="text-xl">Mutasd be, mit szeretnél elérni, és milyen szempontok alapján tekinted sikeresnek a bemutatott munkát vagy témát.</p>
  <div class="grid grid-cols-3 gap-5 mt-8">
    <div class="p-5 rounded-xl border-t-4 border-[#c8a048] bg-[#1a2a5a]/5">
      <div class="text-4xl font-bold text-[#1a2a5a] mb-3">01</div>
      <h3 class="font-bold text-lg mb-2">[Cél egy]</h3>
      <p class="text-sm opacity-80">[Mit jelent a cél a gyakorlatban?]</p>
    </div>
    <div class="p-5 rounded-xl border-t-4 border-[#c8a048] bg-[#1a2a5a]/5">
      <div class="text-4xl font-bold text-[#1a2a5a] mb-3">02</div>
      <h3 class="font-bold text-lg mb-2">[Cél kettő]</h3>
      <p class="text-sm opacity-80">[Hogyan mérhető vagy ellenőrizhető?]</p>
    </div>
    <div class="p-5 rounded-xl border-t-4 border-[#c8a048] bg-[#1a2a5a]/5">
      <div class="text-4xl font-bold text-[#1a2a5a] mb-3">03</div>
      <h3 class="font-bold text-lg mb-2">[Cél három]</h3>
      <p class="text-sm opacity-80">[Milyen eredményt vársz tőle?]</p>
    </div>
  </div>
</div>

---

::header::
Megközelítés és módszertan
::default::

<div class="grid grid-cols-2 gap-8 h-full items-center">
  <div class="space-y-4">
    <h2 class="text-2xl font-bold">Hogyan épül fel a téma?</h2>
    <p class="opacity-85">Írd le a legfontosabb lépéseket vagy gondolatokat olyan sorrendben, ahogy a közönségnek érdemes megismernie őket.</p>
    <ul class="space-y-3 text-lg">
      <li class="flex gap-3 items-start"><span class="text-[#c8a048] font-bold">01</span><span>[Feltárás / kutatás / igényfelmérés]</span></li>
      <li class="flex gap-3 items-start"><span class="text-[#c8a048] font-bold">02</span><span>[Tervezés és alternatívák]</span></li>
      <li class="flex gap-3 items-start"><span class="text-[#c8a048] font-bold">03</span><span>[Megvalósítás / elemzés]</span></li>
      <li class="flex gap-3 items-start"><span class="text-[#c8a048] font-bold">04</span><span>[Ellenőrzés és értékelés]</span></li>
    </ul>
  </div>
  <div class="flex justify-center">
    <div class="w-64 h-64 rounded-full border-8 border-[#1a2a5a]/10 flex items-center justify-center relative">
      <div class="absolute inset-3 rounded-full border-4 border-dashed border-[#c8a048]"></div>
      <div class="text-center px-8"><div class="text-2xl font-bold">Módszer</div><div class="text-sm opacity-70 mt-2">[Rövid összefoglaló]</div></div>
    </div>
  </div>
</div>

---

::header::
Tervezés és architektúra
::default::

<div class="space-y-6 mt-4">
  <p class="text-lg opacity-85">Itt mutasd be a téma vagy projekt felépítését, a fontosabb összefüggéseket és a kapcsolódó döntéseket.</p>
  <div class="grid grid-cols-3 gap-4 items-stretch">
    <div class="rounded-lg bg-[#1a2a5a] text-white p-5 flex flex-col justify-center min-h-40">
      <h3 class="font-bold text-lg mb-2">[Komponens A]</h3><p class="text-sm opacity-85">[Feladat / felelősség]</p>
    </div>
    <div class="rounded-lg border-2 border-[#c8a048] bg-white p-5 flex flex-col justify-center min-h-40">
      <h3 class="font-bold text-lg mb-2">[Komponens B]</h3><p class="text-sm opacity-85">[Kapcsolat és adatáramlás]</p>
    </div>
    <div class="rounded-lg bg-[#1a2a5a] text-white p-5 flex flex-col justify-center min-h-40">
      <h3 class="font-bold text-lg mb-2">[Komponens C]</h3><p class="text-sm opacity-85">[Feladat / felelősség]</p>
    </div>
  </div>
  <p class="text-sm opacity-70">Tipp: a dobozokat cseréld saját diagramra, képernyőképre vagy egy rövid kódrészletre.</p>
</div>

---

::header::
Megvalósítás
::default::

<div class="grid grid-cols-2 gap-8 items-start mt-4">
  <div class="space-y-4">
    <h2 class="text-2xl font-bold">A legfontosabb gondolatok</h2>
    <ul class="space-y-3 text-lg">
      <li class="flex gap-3"><span class="text-[#c8a048]">●</span><span>[Első lényeges funkció vagy munkafázis]</span></li>
      <li class="flex gap-3"><span class="text-[#c8a048]">●</span><span>[Második lényeges funkció vagy munkafázis]</span></li>
      <li class="flex gap-3"><span class="text-[#c8a048]">●</span><span>[Technológia vagy eszköz, és az indoklás]</span></li>
    </ul>
  </div>
  <div class="border-2 border-dashed border-[#1a2a5a]/25 rounded-xl min-h-64 flex flex-col items-center justify-center text-center p-8 bg-[#1a2a5a]/5">
    <div class="text-5xl text-[#c8a048] mb-4">＋</div>
    <h3 class="text-xl font-bold">Kép vagy demonstráció helye</h3>
    <p class="text-sm opacity-70 mt-2">Cseréld le egy képernyőképre, prototípusra, kódra vagy saját ábrára.</p>
  </div>
</div>

---

::header::
Tesztelés és értékelés
::default::

<div class="space-y-6 mt-4">
  <p class="text-lg opacity-85">Mutasd meg, milyen példák, adatok vagy tapasztalatok támasztják alá a fő állításaidat.</p>
  <div class="grid grid-cols-3 gap-5">
    <div class="border border-[#1a2a5a]/15 rounded-xl p-5">
      <div class="text-sm font-bold text-[#c8a048] uppercase tracking-wider">01 · Ellenőrzés</div>
      <h3 class="text-xl font-bold mt-3 mb-2">[Mit teszteltél?]</h3>
      <p class="text-sm opacity-80">[Milyen módszerrel és milyen környezetben?]</p>
    </div>
    <div class="border border-[#1a2a5a]/15 rounded-xl p-5">
      <div class="text-sm font-bold text-[#c8a048] uppercase tracking-wider">02 · Eredmény</div>
      <h3 class="text-xl font-bold mt-3 mb-2">[Mit mutatnak az adatok?]</h3>
      <p class="text-sm opacity-80">[Konkrét megfigyelés, mérés vagy visszajelzés.]</p>
    </div>
    <div class="border border-[#1a2a5a]/15 rounded-xl p-5">
      <div class="text-sm font-bold text-[#c8a048] uppercase tracking-wider">03 · Következtetés</div>
      <h3 class="text-xl font-bold mt-3 mb-2">[Mi következik ebből?]</h3>
      <p class="text-sm opacity-80">[Mi teljesült, és mi maradt nyitott kérdés?]</p>
    </div>
  </div>
</div>

---

::header::
Eredmények és tanulságok
::default::

<div class="grid grid-cols-2 gap-8 mt-8">
  <div>
    <h2 class="text-2xl font-bold mb-4">Amit sikerült elérni</h2>
    <ul class="space-y-4 text-lg">
      <li class="flex gap-3 items-start"><span class="text-green-600 font-bold">✓</span><span>[Eredmény, lehetőleg konkrét adattal]</span></li>
      <li class="flex gap-3 items-start"><span class="text-green-600 font-bold">✓</span><span>[Teljesült cél vagy igazolt feltevés]</span></li>
      <li class="flex gap-3 items-start"><span class="text-green-600 font-bold">✓</span><span>[Legfontosabb szakmai tanulság]</span></li>
    </ul>
  </div>
  <div class="bg-[#1a2a5a] text-white rounded-2xl p-7">
    <div class="text-[#c8a048] font-bold uppercase tracking-widest text-sm">Reflexió</div>
    <p class="text-2xl leading-relaxed mt-4">[Mi volt a legfontosabb felismerésed a téma feldolgozása közben?]</p>
    <p class="text-sm opacity-75 mt-5">[Miben változott a gondolkodásod vagy a gyakorlatod?]</p>
  </div>
</div>

---

::header::
Folytatás és továbbfejlesztés
::default::

<div class="mt-8 flex justify-between gap-6 text-center">
  <div class="w-1/3 border-t-4 border-[#c8a048] pt-5">
    <div class="text-4xl font-bold text-[#1a2a5a] mb-3">1.</div>
    <h3 class="font-bold text-xl mb-2">Rövid táv</h3>
    <p class="text-sm opacity-80">[Azonnal megvalósítható javítás vagy lezáró feladat]</p>
  </div>
  <div class="w-1/3 border-t-4 border-[#c8a048] pt-5">
    <div class="text-4xl font-bold text-[#1a2a5a] mb-3">2.</div>
    <h3 class="font-bold text-xl mb-2">Középtáv</h3>
    <p class="text-sm opacity-80">[Bővítés, új teszt vagy további vizsgálat]</p>
  </div>
  <div class="w-1/3 border-t-4 border-[#c8a048] pt-5">
    <div class="text-4xl font-bold text-[#1a2a5a] mb-3">3.</div>
    <h3 class="font-bold text-xl mb-2">Hosszú táv</h3>
    <p class="text-sm opacity-80">[Lehetséges új irány vagy nagyobb cél]</p>
  </div>
</div>

---

::header::
Köszönöm a figyelmet!
::default::

<div class="h-full flex flex-col items-center justify-center text-center px-10">
  <div class="w-24 border-t-4 border-[#c8a048] mb-8"></div>
  <h1 class="text-5xl font-bold text-[#1a2a5a] mb-6">Köszönöm a figyelmet!</h1>
  <p class="text-2xl opacity-85 mb-8">Kérdések és észrevételek</p>
  <div class="text-lg font-semibold">[Előadó neve]</div>
  <div class="text-sm opacity-70 mt-2">[Kurzus / szervezeti egység – opcionális] · [Dátum]</div>
</div>
