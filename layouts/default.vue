<template>
  <div class="slidev-layout default w-full h-full p-0 flex flex-col bg-white">
    <header
      class="w-full bg-[#2b3358] h-28 flex items-center justify-between px-12 border-b-[6px] border-[#c8a048] relative z-20 shadow-md"
    >
      <div class="text-white text-4xl font-bold font-sans leading-tight max-w-[78%]">
        <slot name="header" />
      </div>
      <div class="w-64 h-[5.5rem] shrink-0 overflow-hidden rounded-sm">
        <img src="/assets/ekke-logo-inverse.jpg" class="w-full h-full object-cover" alt="Eszterházy Károly Katolikus Egyetem" />
      </div>
    </header>

    <main class="flex-1 w-full relative p-6 overflow-hidden">
      <div class="absolute inset-0 opacity-40 flex justify-center items-center pointer-events-none">
        <img src="/assets/ekke-logo.jpg" class="w-2/3 opacity-[0.07] mix-blend-multiply object-contain" alt="" />
      </div>
      <div class="relative z-10 text-[#1a2a5a]">
        <slot name="default" />
      </div>
    </main>
  </div>
</template>
