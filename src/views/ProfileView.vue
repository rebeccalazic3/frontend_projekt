<script setup>
import { computed, ref } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import authService from '@/services/authService'

const user = computed(() => {
  try {
    const token = localStorage.getItem('token')
    if (!token) return null
    const payload = JSON.parse(atob(token.split('.')[1]))
    return {
      username: payload.username || '—',
      email: payload.email || '—',
    }
  } catch {
    return null
  }
})

const userInitial = computed(() => user.value?.username?.charAt(0).toUpperCase() || '?')

// Username forma
const showUsernameForm = ref(false)
const usernameForm = ref({ username: '', currentPassword: '' })
const usernameLoading = ref(false)
const usernameError = ref('')
const usernameSuccess = ref('')

async function submitUsernameChange() {
  usernameError.value = ''
  usernameSuccess.value = ''
  usernameLoading.value = true
  try {
    const res = await authService.updateUsername(usernameForm.value)
    localStorage.setItem('token', res.data.token)
    usernameSuccess.value = res.data.message
    usernameForm.value = { username: '', currentPassword: '' }
    showUsernameForm.value = false
  } catch (err) {
    usernameError.value = err.response?.data?.error || 'Greška pri promjeni korisničkog imena.'
  } finally {
    usernameLoading.value = false
  }
}

// Email forma
const showEmailForm = ref(false)
const emailForm = ref({ email: '', currentPassword: '' })
const emailLoading = ref(false)
const emailError = ref('')
const emailSuccess = ref('')

async function submitEmailChange() {
  emailError.value = ''
  emailSuccess.value = ''
  emailLoading.value = true
  try {
    const res = await authService.updateEmail(emailForm.value)
    localStorage.setItem('token', res.data.token)
    emailSuccess.value = res.data.message
    emailForm.value = { email: '', currentPassword: '' }
    showEmailForm.value = false
  } catch (err) {
    emailError.value = err.response?.data?.error || 'Greška pri promjeni emaila.'
  } finally {
    emailLoading.value = false
  }
}

// Lozinka forma
const showPasswordForm = ref(false)
const passwordForm = ref({ currentPassword: '', newPassword: '', confirmPassword: '' })
const passwordLoading = ref(false)
const passwordError = ref('')
const passwordSuccess = ref('')

async function submitPasswordChange() {
  passwordError.value = ''
  passwordSuccess.value = ''

  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordError.value = 'Nova lozinka i potvrda se ne podudaraju.'
    return
  }

  passwordLoading.value = true
  try {
    const res = await authService.updatePassword({
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword,
    })
    passwordSuccess.value = res.data.message
    passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
    showPasswordForm.value = false
  } catch (err) {
    passwordError.value = err.response?.data?.error || 'Greška pri promjeni lozinke.'
  } finally {
    passwordLoading.value = false
  }
}
</script>

<template>
  <MainLayout>
    <!-- Header baner -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-6 flex items-center gap-6">
      <div class="h-20 w-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold shrink-0">
        {{ userInitial }}
      </div>
      <div>
        <h2 class="text-2xl font-bold text-slate-800">{{ user?.username }}</h2>
        <p class="text-slate-500 mt-1">{{ user?.email }}</p>
      </div>
    </div>

    <!-- Detalji -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <h3 class="text-lg font-semibold text-slate-800 mb-5">Podaci računa</h3>

      <div class="divide-y divide-slate-100">

        <!-- Korisničko ime -->
        <div class="py-4">
          <div class="flex justify-between items-center">
            <p class="text-sm text-slate-500">Korisničko ime</p>
            <div class="flex items-center gap-3">
              <p class="text-sm font-medium text-slate-800">{{ user?.username }}</p>
              <button
                @click="showUsernameForm = !showUsernameForm; usernameError = ''; usernameSuccess = ''"
                class="text-xs text-blue-600 hover:underline"
              >
                {{ showUsernameForm ? 'Odustani' : 'Promijeni' }}
              </button>
            </div>
          </div>

          <div v-if="usernameSuccess" class="mt-3 text-sm text-green-600">{{ usernameSuccess }}</div>

          <form v-if="showUsernameForm" @submit.prevent="submitUsernameChange" class="mt-4 space-y-3">
            <div>
              <label class="block text-xs text-slate-500 mb-1">Novo korisničko ime</label>
              <input
                v-model="usernameForm.username"
                type="text"
                required
                class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-xs text-slate-500 mb-1">Trenutna lozinka</label>
              <input
                v-model="usernameForm.currentPassword"
                type="password"
                required
                class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div v-if="usernameError" class="text-sm text-red-500">{{ usernameError }}</div>
            <button
              type="submit"
              :disabled="usernameLoading"
              class="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {{ usernameLoading ? 'Spremanje...' : 'Spremi korisničko ime' }}
            </button>
          </form>
        </div>

        <!-- Email -->
        <div class="py-4">
          <div class="flex justify-between items-center">
            <p class="text-sm text-slate-500">Email</p>
            <div class="flex items-center gap-3">
              <p class="text-sm font-medium text-slate-800">{{ user?.email }}</p>
              <button
                @click="showEmailForm = !showEmailForm; emailError = ''; emailSuccess = ''"
                class="text-xs text-blue-600 hover:underline"
              >
                {{ showEmailForm ? 'Odustani' : 'Promijeni' }}
              </button>
            </div>
          </div>

          <div v-if="emailSuccess" class="mt-3 text-sm text-green-600">{{ emailSuccess }}</div>

          <form v-if="showEmailForm" @submit.prevent="submitEmailChange" class="mt-4 space-y-3">
            <div>
              <label class="block text-xs text-slate-500 mb-1">Novi email</label>
              <input
                v-model="emailForm.email"
                type="email"
                required
                class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-xs text-slate-500 mb-1">Trenutna lozinka</label>
              <input
                v-model="emailForm.currentPassword"
                type="password"
                required
                class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div v-if="emailError" class="text-sm text-red-500">{{ emailError }}</div>
            <button
              type="submit"
              :disabled="emailLoading"
              class="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {{ emailLoading ? 'Spremanje...' : 'Spremi email' }}
            </button>
          </form>
        </div>

        <!-- Lozinka -->
        <div class="py-4">
          <div class="flex justify-between items-center">
            <p class="text-sm text-slate-500">Lozinka</p>
            <div class="flex items-center gap-3">
              <p class="text-sm text-slate-400">••••••••</p>
              <button
                @click="showPasswordForm = !showPasswordForm; passwordError = ''; passwordSuccess = ''"
                class="text-xs text-blue-600 hover:underline"
              >
                {{ showPasswordForm ? 'Odustani' : 'Promijeni' }}
              </button>
            </div>
          </div>

          <div v-if="passwordSuccess" class="mt-3 text-sm text-green-600">{{ passwordSuccess }}</div>

          <form v-if="showPasswordForm" @submit.prevent="submitPasswordChange" class="mt-4 space-y-3">
            <div>
              <label class="block text-xs text-slate-500 mb-1">Trenutna lozinka</label>
              <input
                v-model="passwordForm.currentPassword"
                type="password"
                required
                class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-xs text-slate-500 mb-1">Nova lozinka</label>
              <input
                v-model="passwordForm.newPassword"
                type="password"
                required
                class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-xs text-slate-500 mb-1">Potvrdi novu lozinku</label>
              <input
                v-model="passwordForm.confirmPassword"
                type="password"
                required
                class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div v-if="passwordError" class="text-sm text-red-500">{{ passwordError }}</div>
            <button
              type="submit"
              :disabled="passwordLoading"
              class="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {{ passwordLoading ? 'Spremanje...' : 'Spremi lozinku' }}
            </button>
          </form>
        </div>

      </div>
    </div>
  </MainLayout>
</template>
