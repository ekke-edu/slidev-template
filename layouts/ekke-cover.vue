<template>
  <div class="ekke-cover absolute inset-0 overflow-hidden font-sans">
    <div class="cover-top absolute inset-x-0 top-0" />
    <div class="cover-bottom absolute inset-x-0 bottom-0" />
    <div class="cover-content absolute inset-0">
      <slot />
    </div>
    <img
      class="cover-logo absolute left-1/2 top-1/2"
      src="/assets/ekke-logo-cover.png"
      alt="Eszterházy Károly Katolikus Egyetem"
    />
  </div>
</template>

<style>
.ekke-cover {
  color: #1a2a5a;
  background: #fff;
}

.ekke-cover .cover-top {
  height: 50%;
  background: #1a2a5a;
}

.ekke-cover .cover-bottom {
  height: 50%;
  background: #fff;
}

.ekke-cover .cover-logo {
  z-index: 2;
  width: min(70vw, 34rem);
  height: auto;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.ekke-cover .cover-content {
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.ekke-cover .cover-content h1 {
  position: absolute;
  top: 10%;
  width: 90%;
  margin: 0;
  border: 0;
  color: #fff;
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  line-height: 1.12;
}

.ekke-cover .cover-content blockquote {
  position: absolute;
  top: 64%;
  width: 90%;
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 1.2rem;
  line-height: 1.45;
}

.ekke-cover .cover-content blockquote p {
  margin: 0.45rem 0;
}

.ekke-cover .cover-content blockquote p:nth-of-type(2) {
  margin-top: 1rem;
  font-size: 1.8rem;
  font-weight: 700;
}

.ekke-cover .cover-content blockquote p:last-child {
  margin-top: 1rem;
  font-weight: 700;
}
</style>
