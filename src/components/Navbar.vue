<template>
  <nav class="navbar">
    <div class="nav-container">
      <ul class="nav-links">
        <li>
          <router-link to="/" class="nav-link">Home</router-link>
        </li>
        <li>
          <router-link to="/about" class="nav-link">Sobre</router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
// Navbar component for navigation between home and about pages
</script>

<style scoped>
.navbar {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 10px 0;
  margin-bottom: 20px;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.nav-logo .nav-link {
  color: white;
  text-decoration: none;
  font-size: 1.5em;
  font-weight: bold;
}

.nav-links {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 20px;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 10px 15px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
  font-weight: bold;
}
</style>
