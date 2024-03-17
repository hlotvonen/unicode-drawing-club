<script>
  import { settings } from "../store";
</script>

<div class="radio-buttons-container">
  <div class="radio-buttons">
    <form>
      {#each { length: 10 } as _, i}
        <label class="radio-label" for="first{i}"
          >{i}
          <input
            type="radio"
            id="first{i}"
            name="number"
            value={i}
            class="radio-input"
            checked={$settings.pageNumberLeft === i}
            on:change={() => ($settings.pageNumberLeft = i)}
          />
        </label>
      {/each}
    </form>
  </div>
  <div class="radio-buttons">
    <form>
      {#each { length: 10 } as _, i}
        <label class="radio-label" for="second{i}"
          >{i}
          <input
            type="radio"
            id="second{i}"
            name="number"
            value={i}
            class="radio-input"
            checked={$settings.pageNumberRight === i}
            on:change={() => ($settings.pageNumberRight = i)}
          />
        </label>
      {/each}
    </form>
  </div>
</div>

<style>
  .radio-buttons-container {
    display: flex;
    justify-content: center;
    border-bottom: 1px solid var(--foregroundColor);
    flex-wrap: wrap;
  }
  .radio-buttons-container div:first-child {
    border-right: 3px solid var(--highlightColor);
  }
  .radio-buttons {
    flex: 1;
  }
  .radio-buttons form {
    display: flex;
    flex: 1;
  }
  .radio-input {
    display: none; /* Hide the default radio button */
  }

  .radio-label {
    flex: 1;
    background-color: var(--foregroundColor);
    color: var(--backgroundColor);
    text-align: center;
    line-height: 1; /* Vertically center the text */
    cursor: pointer;
    padding: 3px;
    border: 1px solid var(--backgroundColor);
  }

  .radio-label:has(.radio-input:checked) {
    background-color: var(--highlightColor);
  }
</style>
