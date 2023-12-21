<template>
  <div class="selector-div" :id="`${uniqueSelectorId}-selector-div`">
    <div class="label-div">
      <label class="selector-label" for="select-input">
        {{ selectorLabel }}
      </label>
      <div
        :id="'select-status-' + uniqueSelectorId"
        class="hidden-visually"
        aria-live="polite"
      >
        {{ filteredOptions.length }}
        {{ `aria.${uniqueSelectorId}.selector.status.text` | translate }}
      </div>
    </div>
    <div
      class="select-container"
      :id="'select-container-' + uniqueSelectorId"
      @click="handleSelectorClick"
      @keydown="handleKeyDown"
      @keyup="handleKeyUp"
      role="combobox"
      aria-haspopup="listbox"
      aria-autocomplete="list"
      :aria-owns="'select-list-' + uniqueSelectorId"
      :aria-expanded="showOptions ? 'true' : 'false'"
    >
      <div class="input-container">
        <input
          type="text"
          class="base-input filter-input"
          :id="'select-input-' + uniqueSelectorId"
          :ref="'selectInput-' + uniqueSelectorId"
          v-model="filterInputValue"
          :aria-describedby="'select-info-' + uniqueSelectorId"
          :aria-controls="'select-list-' + uniqueSelectorId"
        />
        <input
          :id="'selection-input-' + uniqueSelectorId"
          :class="[
            'base-input',
            'selection-input',
            filterInputValue.length > 0 ? 'hidden-text' : ''
          ]"
          readonly
          disabled
          v-model="selectInputValue"
        />
        <input
          class="base-input pseudo-input"
          style="position: static;"
          readonly
          disabled
          value=""
        />
      </div>
      <span :id="'select-info-' + uniqueSelectorId" class="hidden-visually">
        {{ `aria.${uniqueSelectorId}.selector.describe` | translate }}
      </span>
      <div class="dropdown-icon-container">
        <span class="select-icon">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fill-rule="evenodd"
            clip-rule="evenodd"
            focusable="false"
            aria-hidden="true"
            :id="'icon-circle-down-' + uniqueSelectorId"
            v-bind:class="[
              !showOptions ? '' : 'rotate',
              !initialized ? 'hidden-all' : '',
              'icon'
            ]"
            role="img"
          >
            <path
              d="M23.245 4l-11.245 14.374-11.219-14.374-.781.619 12 15.381 12-15.391-.755-.609z"
            />
          </svg>
        </span>
      </div>

      <ul
        v-bind:class="[
          showOptions && filteredOptions.length > 0 ? '' : 'hidden-all',
          'select-options'
        ]"
        :id="'select-list-' + uniqueSelectorId"
        role="listbox"
      >
        <li
          v-for="option in filteredOptions"
          :key="option.id"
          :class="[option.id === selectedOption.id ? 'selected-option' : '']"
          tabindex="-1"
          role="option"
          :ref="'options-' + uniqueSelectorId + option.id"
        >
          {{ option.label[lang] }} <span> {{ option.id }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { Option } from "@/types";
import { mapState } from "vuex";

const findFocus = (): HTMLElement => {
  const focusPoint = document.activeElement;
  return focusPoint as HTMLElement;
};

export default Vue.extend({
  props: {
    uniqueSelectorId: String,
    selectorLabel: String,
    options: { type: Array as PropType<Option[]> },
    initialOption: { type: Object as PropType<Option> }
  },
  data() {
    return {
      filteredOptions: [] as Option[],
      showOptions: false as boolean,
      selectedOption: undefined as Option | undefined,
      selectorState: "initial" as string,
      filterInputValue: "" as string,
      selectInputValue: "" as string,
      initialized: false as boolean
    };
  },
  computed: mapState(["lang"]),
  watch: {
    options(newOptions: Option[], oldOptions: Option[]) {
      this.filteredOptions = [...newOptions].sort(this.optionsSort);
      // update label of the selected option by new options
      if (oldOptions && this.selectedOption) {
        const updatedSelectedOption = newOptions.find(
          (option) => option.id === this.selectedOption!.id
        );
        if (updatedSelectedOption) {
          this.selectedOption = updatedSelectedOption;
          this.selectInputValue = updatedSelectedOption.label[this.lang];
        }
      }
    }
  },
  methods: {
    async initializeOptions() {
      this.selectInputValue = this.initialOption.label[this.lang];
      this.selectedOption = this.initialOption;
      this.$emit("selected-option", this.selectedOption);
      this.filteredOptions = [...this.options].sort(this.optionsSort);
      this.initialized = true;
    },
    optionsSort(a: Option, b: Option) {
      if (a.showFirst) {
        return -1;
      } else if (b.showFirst) {
        return 1;
      }
      return a.label[this.lang].localeCompare(b.label[this.lang]);
    },
    filterOptions(): void {
      this.filteredOptions = this.options
        .filter((o) => {
          return o.label[this.lang]
            .toLowerCase()
            .includes(this.filterInputValue.toLowerCase());
        })
        .sort(this.optionsSort);
    },
    getOptionByid(id: string): Option | undefined {
      return this.options.find((o) => o.id === id);
    },
    toggleSelectorOpen(open: boolean | undefined = undefined) {
      if (open !== undefined) {
        this.showOptions = open;
        // this.selectedOption is defined always after initialization
        if (!open && this.selectedOption) {
          this.filterInputValue = "";
          // set previosly selected value to input if exiting selector
          this.selectInputValue = this.selectedOption.label[this.lang];
          this.filteredOptions = [...this.options].sort(this.optionsSort);
        }
      } else {
        this.showOptions = !this.showOptions;
        if (!this.showOptions) {
          this.filterInputValue = "";
        }
      }
    },
    setState(state: string) {
      this.selectorState = state;
    },
    getInputElement(): HTMLElement {
      return this.$refs["selectInput-" + this.uniqueSelectorId] as HTMLElement;
    },
    handleSelectorClick() {
      if (!this.initialized) {
        return;
      }
      const currentFocus = findFocus();
      switch (this.selectorState) {
        case "initial":
          this.toggleSelectorOpen(true);
          this.setState("opened");
          break;
        case "opened":
          if (currentFocus === this.getInputElement()) {
            this.toggleSelectorOpen(false);
            this.setState("initial");
          } else if (currentFocus && currentFocus.tagName === "LI") {
            this.makeChoice(currentFocus);
            this.toggleSelectorOpen(false);
            this.setState("closed");
          }
          break;
        case "filtered": // i.e. option was selected
          if (currentFocus && currentFocus.tagName === "LI") {
            this.makeChoice(currentFocus);
            this.toggleSelectorOpen(false);
            this.setState("closed");
          } else {
            this.toggleSelectorOpen();
            this.setState(this.showOptions ? "opened" : "closed");
          }
          break;
        case "closed":
          this.toggleSelectorOpen(true);
          this.setState("filtered");
          break;
      }
    },
    getOptionIdFromElement(element: HTMLElement): string {
      return element!.querySelector("span")!.textContent!.trim();
    },
    makeChoice(whichOption: HTMLElement) {
      // read option identifier from hidden span element
      const optionId = this.getOptionIdFromElement(whichOption);
      const option = this.getOptionByid(optionId);

      if (option) {
        this.setSelectedOption(option, true);
      } else {
        console.log("Could not select:", optionId);
      }
    },
    setSelectedOption(option: Option, focusInput: boolean) {
      this.selectedOption = option;
      this.selectInputValue = option.label[this.lang];
      this.$emit("selected-option", option);
      if (focusInput) {
        this.moveFocus(findFocus(), "input");
      }
    },
    getOptionAtIndex(index: number): HTMLLIElement {
      const option = this.filteredOptions[index];
      // @ts-ignore
      return this.$refs["options-" + this.uniqueSelectorId + option.id][0] as HTMLLIElement;
    },
    moveFocus(fromHere: HTMLElement, toThere: string) {
      if (toThere === "input" || this.filteredOptions.length == 0) {
        this.getInputElement().focus();
        return;
      }
      switch (fromHere) {
        case this.getInputElement():
          if (toThere === "forward") {
            this.getOptionAtIndex(0).focus();
          } else if (toThere === "back") {
            this.getOptionAtIndex(this.filteredOptions.length - 1).focus();
          }
          break;
        case this.getOptionAtIndex(0):
          if (toThere === "forward" && this.filteredOptions[1]) {
            this.getOptionAtIndex(1).focus();
          } else if (toThere === "back") {
            this.getInputElement().focus();
          }
          break;
        case this.getOptionAtIndex(this.filteredOptions.length - 1):
          if (toThere === "forward") {
            this.getOptionAtIndex(0).focus();
          } else if (toThere === "back") {
            this.getOptionAtIndex(this.filteredOptions.length - 2).focus();
          }
          break;
        default: {
          const currentItem = findFocus();
          const selectedValue = currentItem ? this.getOptionIdFromElement(currentItem) : "";
          const indexOfSelectedValue = this.filteredOptions
            .map((o) => o.id)
            .indexOf(selectedValue);
          if (toThere === "forward") {
            this.getOptionAtIndex(indexOfSelectedValue + 1).focus();
          } else if (toThere === "back" && indexOfSelectedValue > 0) {
            this.getOptionAtIndex(indexOfSelectedValue - 1).focus();
          } else {
            this.getInputElement().focus();
          }
          break;
        }
      }
    },
    preventKeyDownScroll(e: KeyboardEvent) {
      const code = e.keyCode ? e.keyCode : e.code;
      switch (code) {
        case 38:
        case 40: // Arrow keys
          e.preventDefault();
          break;
        default:
          break; // do not block other keys
      }
    },
    handleKeyDown(whichKey: KeyboardEvent) {
      this.preventKeyDownScroll(whichKey);
      if (whichKey.code === "Tab") {
        this.toggleSelectorOpen(false);
        this.setState("closed");
        return;
      }
      const currentFocus = findFocus();
      switch (whichKey.code) {
        case "Enter":
          if (this.selectorState === "initial") {
            this.toggleSelectorOpen(true);
            this.setState("opened");
          } else if (
            this.selectorState === "opened" &&
            currentFocus &&
            currentFocus.tagName === "LI"
          ) {
            this.makeChoice(currentFocus);
            this.toggleSelectorOpen(false);
            this.setState("closed");
          } else if (
            this.selectorState === "opened" &&
            currentFocus === this.getInputElement()
          ) {
            this.toggleSelectorOpen(false);
            this.setState("closed");
          } else if (
            this.selectorState === "filtered" &&
            currentFocus &&
            currentFocus.tagName === "LI"
          ) {
            this.makeChoice(currentFocus);
            this.toggleSelectorOpen(false);
            this.setState("closed");
          } else if (
            this.selectorState === "filtered" &&
            currentFocus === this.getInputElement()
          ) {
            this.toggleSelectorOpen(true);
            this.setState("opened");
          } else {
            this.toggleSelectorOpen(true);
            this.setState("filtered");
          }
          break;

        case "Escape":
          if (this.selectorState === "opened" || this.selectorState === "filtered") {
            this.toggleSelectorOpen(false);
            this.setState("initial");
          }
          break;

        case "ArrowDown":
          if (this.selectorState === "initial" || this.selectorState === "closed") {
            this.toggleSelectorOpen(true);
            this.moveFocus(this.getInputElement(), "forward");
            this.setState("opened");
          } else {
            this.toggleSelectorOpen(true);
            this.moveFocus(currentFocus, "forward");
          }
          break;
        case "ArrowUp":
          if (this.selectorState === "initial" || this.selectorState === "closed") {
            this.toggleSelectorOpen(true);
            this.moveFocus(this.getInputElement(), "back");
            this.setState("opened");
          } else {
            this.moveFocus(currentFocus, "back");
          }
          break;
        default:
          // let's move focus back to input if it's somewhere else at normal (letter) key down
          // shift key should not cause this
          if (findFocus() !== this.getInputElement() && whichKey.keyCode !== 16) {
            this.moveFocus(findFocus(), "input");
          }
      }
    },
    handleKeyUp(whichKey: KeyboardEvent) {
      switch (whichKey.code) {
        case "Enter":
        case "Escape":
        case "ArrowDown":
        case "ArrowUp":
          break;
        default:
          this.filterOptions();
          if (this.selectorState === "initial" || this.selectorState === "closed") {
            this.toggleSelectorOpen(true);
            this.setState("filtered");
          } else if (this.selectorState === "opened") {
            this.setState("filtered");
          }
      }
    }
  },
  mounted() {
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target && !target.closest("#select-container-" + this.uniqueSelectorId)) {
        this.toggleSelectorOpen(false);
        this.setState("initial");
      }
    });
    this.initializeOptions();
  }
});
</script>

<style scoped>
.selector-div {
  background: #ffffff;
  max-width: 100%;
  margin: 0em 1em 1em 0em;
}
@media (max-width: 516px) {
  .selector-div {
    margin: 5px 5px 8px 5px;
  }
}
.label-div {
  display: flex;
  align-items: flex-start;
  padding-bottom: 2px;
}
.selector-label {
  font-weight: 500;
  margin: 0 1px 0px 2px;
}
.select-container {
  position: relative;
}
.input-container {
  position: relative;
}
.base-input {
  position: absolute;
  display: block;
  font-size: 15px;
  font-family: sans-serif;
  line-height: 1;
  padding: 10px 13px 8px 13px;
  border: 1px solid transparent;
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  border-radius: 4px;
}
.filter-input {
  background: none;
  color: black;
  padding: 10px 15px 8px 11px;
  border: 1px solid #7f7f7f;
  box-shadow: 0 1px 0 1px rgba(0, 0, 0, 0.04);
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  z-index: 11;
  transition: all 100ms ease 0s;
}
.filter-input:focus {
  border: 1px solid rgb(38, 132, 255);
  box-shadow: rgb(38, 132, 255) 0px 0px 0px 1px;
  color: #222;
  outline: none;
  outline: 0px !important;
}
.input-container input::-ms-expand {
  display: none;
}
.selection-input {
  color: black;
  z-index: 10;
  pointer-events: none;
  background-color: #fff;
  -webkit-text-fill-color: #000000;
  opacity: 1; /* required on iOS */
}
.hidden-text {
  color: white;
  -webkit-text-fill-color: white;
  opacity: 0;
}
.pseudo-input {
  color: white;
  border: none;
  z-index: 9;
  pointer-events: none;
  background: none;
}
.dropdown-icon-container {
  position: absolute;
  right: 7px;
  top: 0px;
  display: flex;
  height: 100%;
  align-items: center;
}
.select-icon {
  pointer-events: none;
  margin-bottom: -8px;
  z-index: 20;
  background: transparent;
}
@media (max-width: 516px) {
  .select-icon {
    display: none;
  }
}
.select-options {
  border: 1px solid #aaa;
  border-radius: 4px;
  line-height: 1.5;
  padding: 3px 0px;
  margin: 0;
  margin-top: 7px;
  list-style-type: none;
  font-weight: normal;
  cursor: default;
  z-index: 12;
  position: absolute;
  width: calc(100% - 2px);
  background-color: #ffffff;
  max-height: 400px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 4px 11px;
  overflow: auto;
}
@media (max-height: 580px) {
  .select-options {
    max-height: max(calc(100vh - 170px), 250px);
  }
}
.select-options li {
  display: flex;
  font-size: 15px;
  padding: 7px 13px;
  text-align: left;
}
.select-options li:hover {
  background: rgb(222, 235, 255);
}
.select-options li:focus {
  background: rgb(222, 235, 255);
  border: none;
  outline: none;
}
.selected-option {
  color: white !important;
  background: rgb(38, 132, 255) !important;
}
.select-options li span {
  display: none;
}
.icon {
  fill: ButtonText;
  pointer-events: none;
  transition-duration: 0.2s;
  -webkit-transition-duration: 0.2s; /* Safari */
}
.rotate {
  transform: rotate(180deg);
}
.hidden-all {
  display: none;
}
.hidden-visually {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  -webkit-clip-path: inset(50%);
  clip-path: inset(50%);
  border: 0;
}
</style>
