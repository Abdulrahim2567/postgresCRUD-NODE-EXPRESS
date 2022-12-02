<template>
  <div class="row">
    <h4>New Ticket</h4>
    <div class="col">
      <div class="form">
        <form class="n" novalidate>
          <div class="md-6">
            <label for="1" class="form-label">Passenger Name</label>

            <input
              type="text"
              class="form-control"
              id="1"
              placeholder="Jakeline Jakin"
            />
          </div>
          <div class="mb-3">
            <label for="3" class="form-label">Travel Type</label>
            <select
              class="form-select"
              required
              aria-label="Default select example"
              id="3"
              placeholder="Choose..."
            >
              <option value="Flight">Flight</option>
              <option value="Boat">Boat</option>
              <option value="Train">Train</option>
              <option value="Car">Car</option>
            </select>
            <div class="valid-feedback">Looks good!</div>
            <div class="invalid-feedback">Please select good Travel Type.</div>
          </div>
          <div class="mb-3">
            <label for="4" class="form-label">Airline</label>
            <input
              type="text"
              required
              class="form-control"
              id="4"
              placeholder=""
              maxlength="3"
              minlength="3"
            />
            <div class="valid-feedback">Looks good!</div>
            <div class="invalid-feedback">Please enter good Airline.</div>
          </div>
          <div class="mb-3">
            <label for="6" class="form-label">Itinerary</label>
            <input
              type="text"
              required
              class="form-control"
              id="6"
              placeholder="TML ACC"
            />
            <div class="valid-feedback">Looks good!</div>
            <div class="invalid-feedback">Please enter good Itinerary.</div>
          </div>
          <div class="mb-3">
            <label for="2" class="form-label">Issuing Date</label>
            <input type="date" required class="form-control" id="2" />
            <div class="valid-feedback">Looks good!</div>
            <div class="invalid-feedback">Please enter good Issuing Date.</div>
          </div>
          <div class="mb-3">
            <label for="5" class="form-label">Currency</label>
            <select
              class="form-select"
              required
              aria-label="Default select example"
              id="5"
            >
              <option selected disabled value="XAF">Choose...</option>
              <option value="XAF">XAF</option>
              <option value="£">£</option>
              <option value="$">$</option>
              <option value="€">€</option>
            </select>
            <div class="valid-feedback">Looks good!</div>
            <div class="invalid-feedback">Please select Currency.</div>
          </div>
          <div class="mb-3">
            <label for="7" class="form-label">Amount</label>
            <input
              type="text"
              required
              class="form-control"
              id="7"
              placeholder="40000"
              pattern="/^\d+.?\d*$/"
            />
            <div class="valid-feedback">Looks good!</div>
            <div class="invalid-feedback">Please enter good Amount.</div>
          </div>
          <div class="row">
            <div class="col">
              <div class="formButtonSub">
                <button class="btn btn-success" type="submit">
                  <i class="fa-solid fa-floppy-disk"></i> Save
                </button>
              </div>
            </div>
            <div class="col">
              <div class="formButtonCan">
                <button class="btn btn-secondary">
                  <i class="fa-solid fa-ban"></i> Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
  
  <script>
export default {
  name: "itemNew",
  components: {},
};
</script>
  
  <style lang="scss" scoped>
.container {
  margin: auto;
}
.centers {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>