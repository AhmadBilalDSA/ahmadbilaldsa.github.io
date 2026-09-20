import { useSyncExternalStore } from 'react'
import caseStudies from '../data/caseStudiesData.json'

let activeId = null
const listeners = new Set()

function emit() {
  listeners.forEach((listener) => listener())
}

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return activeId
}

export function openCaseStudy(id) {
  if (!caseStudies[id]) return
  activeId = id
  emit()
}

export function closeCaseStudy() {
  activeId = null
  emit()
}

export function useCaseStudyDrawer() {
  const id = useSyncExternalStore(subscribe, getSnapshot)
  return { id, study: id ? caseStudies[id] : null, open: openCaseStudy, close: closeCaseStudy }
}