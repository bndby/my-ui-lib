export interface RegistryItem {
  name: string
  description: string
  category: string
  files: string[]
  dependencies: string[]
  meta: {
    since: string
    deprecated?: string
    breaking?: string
  }
}

export interface Registry {
  name: string
  version: string
  items: {
    "test-configs": RegistryItem[]
    components: RegistryItem[]
    hooks: RegistryItem[]
    utils: RegistryItem[]
  }
}

export interface Config {
  components: string
  hooks: string
  utils: string
  tests: string
}
