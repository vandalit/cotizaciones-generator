<template>
  <div class="space-y-2">
    <div
      v-for="(item, index) in modelValue"
      :key="index"
      class="flex items-center space-x-2"
    >
      <input
        v-model="modelValue[index]"
        type="text"
        class="form-input flex-1"
        :placeholder="placeholder"
        @input="$emit('update:modelValue', modelValue)"
      />
      <button
        @click="removeItem(index)"
        type="button"
        class="text-red-600 hover:text-red-900 p-1"
      >
        <TrashIcon class="h-4 w-4" />
      </button>
    </div>
    
    <button
      @click="addItem"
      type="button"
      class="flex items-center space-x-2 text-primary-600 hover:text-primary-700 text-sm"
    >
      <PlusIcon class="h-4 w-4" />
      <span>Agregar item</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { PlusIcon, TrashIcon } from '@heroicons/vue/24/outline'

// Props
interface Props {
  modelValue: string[]
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Nuevo item...'
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

// Methods
function addItem(): void {
  const newList = [...props.modelValue, '']
  emit('update:modelValue', newList)
}

function removeItem(index: number): void {
  const newList = props.modelValue.filter((_, i) => i !== index)
  emit('update:modelValue', newList)
}
</script>
