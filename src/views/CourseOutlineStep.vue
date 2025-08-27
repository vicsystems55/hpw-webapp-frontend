<template>
  <div>
    <h6 class="mb-3">
      Course Outline
    </h6>

    <div
      v-for="(section, idx) in sections"
      :key="section.id"
      class="card border shadow-sm mb-3"
    >
      <div
        class="card-header p-1"
        style="background: orange;"
      >
        <div class="d-flex align-items-center justify-content-between w-100">
          <span
            class="mr-2"
            style="white-space: nowrap;"
          >Section&nbsp;{{ idx + 1 }}:</span>
          <input
            v-model="section.title"
            class="form-control form-control-sm mx-2"
            placeholder="Enter section title"
            style="min-width: 0; flex: 1 1 auto;"
            @click.stop
          >
          <button
            class="btn btn-link btn-sm ml-2"
            type="button"
            @click="toggleAccordion(idx)"
          >
            <span v-if="openIndex === idx">&#9650;</span>
            <span v-else>&#9660;</span>
          </button>
          <span
            class="ml-2 d-flex align-items-center justify-content-center bg-danger text-white"
            style="cursor:pointer; font-size: 1.5rem; line-height: 1; width: 3.2rem; height: 2.2rem; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.08);"
            title="Remove section"
            @click.stop="removeSection(idx)"
          >&times;</span>
        </div>
      </div>
      <div
        class="collapse"
        :class="{ show: openIndex === idx }"
      >
        <div class="card-body">
          <div class="d-flex justify-content-end align-items-center mb-2">
            <button
              class="btn btn-outline-success btn-slg"
              type="button"
              @click="updateSection(section, idx)"
            >
              Update
            </button>
          </div>
          <quill-editor
            :key="section.id"
            v-model="section.content"
            :options="quillOptions"
            class="bg-white border rounded my-quill-editor"
          />
        </div>
      </div>
    </div>

    <button
      class="btn btn-secondary  d-flex align-items-center mx-auto mt-4 px-4 py-2 shadow-sm"
      type="button"
      style="font-weight: 500; font-size: 1.1rem; gap: 0.5rem;"
      @click="addSection"
    >
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
import axios from 'axios'

// Register the module

export default {
  name: 'CourseOutlineStep',
  components: { quillEditor },

  props: {
    courseId: {
      type: Number,
      required: true,
    },
  },

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
            ['link', 'image', 'video'],
            ['clean'],
          ],
          imageResize: {
            modules: ['Resize', 'DisplaySize', 'Toolbar'],
          },
        },
      },
    }
  },

  async mounted() {
    await this.getCourseOutlines()
  },

  methods: {
    async getCourseOutlines() {
      try {
        const courseId = localStorage.getItem('currentCourseId') || this.courseId
        if (!courseId) {
          console.warn('No course ID found in localStorage or props.')
          return
        }

        const token = localStorage.getItem('token')
        const res = await axios.get(
          `${process.env.VUE_APP_BACKEND_URL}/api/courses/${courseId}/outlines`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        console.log(res.data.outlines)

        // Assuming outlines come as `res.data.outlines`
        this.sections = (res.data.outlines || []).map(outline => ({
          id: outline.id,
          title: outline.title,
          content: outline.body || '', // adjust if backend uses `content`
        }))

        // If no outlines exist, add a blank one
        // if (this.sections.length === 0) {
        //   this.sections.push({
        //     id: Date.now() + Math.random(),
        //     title: 'Introduction',
        //     content: '',
        //   })
        // }
      } catch (error) {
        console.error('Failed to fetch course outlines:', error.response?.data || error.message)
        this.$toast?.error('Failed to load course outlines.')
      }
    },

    async updateSection(section, idx) {
      try {
        const response = await axios.post(
          `${process.env.VUE_APP_BACKEND_URL}/api/course-outlines`,
          {
            course_id: this.courseId,
            title: section.title,
            body: section.content,
            section_id: section.id ?? '',
          },
        )

        // Update section id if it was just created
        if (!section.id) {
          this.$set(this.sections, idx, {
            ...section,
            id: response.data.id,
          })
        }

        this.$toast.success(`Section ${idx + 1} saved successfully!`)
      } catch (error) {
        console.error('Error saving section:', error.response?.data || error.message)
        this.$toast.error('Failed to save section.')
      }
    },

    removeSection(idx) {
      this.sections.splice(idx, 1)
      if (this.openIndex >= this.sections.length) {
        this.openIndex = this.sections.length - 1
      }
    },

    toggleAccordion(idx) {
      this.openIndex = this.openIndex === idx ? null : idx
    },

    addSection() {
      this.sections.push({
        id: null, // null until saved
        title: '',
        content: '',
      })
      this.openIndex = this.sections.length - 1
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

.my-quill-editor .ql-container {
  height: 400px;         /* fixed editor height */
  border-radius: 8px;    /* rounded edges */
}

.my-quill-editor .ql-editor {
  padding: 16px;         /* inner margin */
  font-family: 'Arial';  /* custom font */
}
</style>
