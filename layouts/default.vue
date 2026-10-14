<template>
  <div class="slidev-layout default w-full h-full p-0 flex flex-col bg-white">
    <header
      class="w-full bg-[#2b3358] h-28 flex items-center justify-between px-12 border-b-[6px] border-[#c8a048] relative z-20 shadow-md"
    >
      <div class="text-white text-4xl font-bold font-sans leading-tight max-w-[78%]">
        <slot name="header" />
      </div>
      <div class="w-64 shrink-0 flex items-center justify-end">
        <img src="/assets/ekke-logo-inverse.png" class="w-full h-auto object-contain" alt="Eszterházy Károly Katolikus Egyetem" />
      </div>
    </header>

    <main class="flex-1 w-full relative p-6 overflow-hidden">
      <div class="absolute inset-0 opacity-40 flex justify-center items-center pointer-events-none">
        <img src="/assets/ekke-logo.png" class="w-2/3 opacity-[0.07] object-contain" alt="" />
      </div>
      <div class="relative z-10 text-[#1a2a5a]">
        <slot name="default" />
      </div>
    </main>
  </div>
</template>
