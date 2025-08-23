<template>
  <div>
    <h6 class="mb-3">Course Outline</h6>
    <transition-group name="section-fade" tag="div">
      <div v-for="(section, idx) in sections" :key="section.id" class="card border shadow-sm mb-3">
        <div class="card-header p-1" style="background: orange;">
          <div class="d-flex align-items-center justify-content-between w-100">
            <span class="mr-2" style="white-space: nowrap;">Section&nbsp;{{ idx + 1 }}:</span>
            <input v-model="section.title" class="form-control form-control-sm mx-2" placeholder="Enter section title"
              @click.stop style="min-width: 0; flex: 1 1 auto;" />
            <button class="btn btn-link btn-sm ml-2" @click="toggleAccordion(idx)" type="button">
              <span v-if="openIndex === idx">&#9650;</span>
              <span v-else>&#9660;</span>
            </button>
            <span class="ml-2 d-flex align-items-center justify-content-center bg-danger text-white"
              style="cursor:pointer; font-size: 1.5rem; line-height: 1; width: 3.2rem; height: 2.2rem; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.08);"
              @click.stop="removeSection(idx)" title="Remove section">&times;</span>
          </div>
        </div>
        <div class="collapse" :class="{ show: openIndex === idx }">
          <div class="card-body">
            <div class="d-flex justify-content-end align-items-center mb-2">
              <button class="btn btn-outline-success btn-slg" type="button" @click="updateSection(section, idx)">
                Update
              </button>
            </div>
            <quill-editor v-model="section.content" :options="quillOptions" :key="section.id"
              class="bg-white border rounded" style="min-height:180px;" />
          </div>
        </div>
      </div>
    </transition-group>

    <button class="btn btn-secondary  d-flex align-items-center mx-auto mt-4 px-4 py-2 shadow-sm" type="button"
      style="font-weight: 500; font-size: 1.1rem; gap: 0.5rem;" @click="addSection">
      <span style="font-size: 1rem; line-height: 1;">&#43;</span>
      Add Section
    </button>
  </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
export default {
  name: 'CourseOutlineStep',
  components: { quillEditor },
  data() {
    return {
      sections: [],
      openIndex: 0, // First section open by default
      quillOptions: {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            ['clean'],
          ],
        },
      },
    }
  },
  mounted() {
    // Add one section by default
    
    this.sections.push({
      id: Date.now() + Math.random(),
      title: 'Introduction',
      content: '',
    })
  },
  methods: {
    updateSection(section, idx) {
      // TODO: Replace with actual API call
      // Example: axios.post('/api/course-outline', { id: section.id, title: section.title, content: section.content })
      alert(`Section ${idx + 1} updated!\nTitle: ${section.title}\nContent: ${section.content.substring(0, 40)}...`)
    },
    removeSection(idx) {
      this.sections.splice(idx, 1)
      // Adjust openIndex if needed
      if (this.openIndex >= this.sections.length) {
        this.openIndex = this.sections.length - 1
      }
    },
    toggleAccordion(idx) {
      this.openIndex = this.openIndex === idx ? null : idx
    },
    addSection() {
      this.sections.push({
        id: Date.now() + Math.random(),
        title: '',
        content: '',
      })
      this.openIndex = this.sections.length - 1 // Open the new section
    },
  },
}
</script>

<style scoped>
.section-fade-enter-active,
.section-fade-leave-active {
  transition: max-height 0.35s cubic-bezier(.4, 0, .2, 1), opacity 0.25s cubic-bezier(.4, 0, .2, 1);
  overflow: hidden;
}

.section-fade-enter-from,
.section-fade-leave-to {
  max-height: 0;
  opacity: 0;
}

.section-fade-enter-to,
.section-fade-leave-from {
  max-height: 500px;
  opacity: 1;
}
</style>
