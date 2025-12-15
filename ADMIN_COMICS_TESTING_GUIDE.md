# Admin Comics CRUD - Manual Testing Guide

## Prerequisites

1. Make sure database migrations are up to date
2. Server is running (npm run dev)
3. You're logged in with admin privileges

## Test Scenarios

### Scenario 1: Create a New Comic

**Steps:**

1. Navigate to `http://localhost:3000/admin/comics`
2. Click the "New Comic" button (top right)
3. Fill in the form:
   - **Title**: "Attack on Titan"
   - **Slug**: Leave empty (will auto-generate)
   - **Description**: "A thrilling tale of humanity's struggle against giant
     humanoid creatures."
   - **Status**: Select "Ongoing"
   - **Publication Date**: Select today's date
   - **Cover Image**: Paste URL: `https://via.placeholder.com/300x400`
4. Leave Author ID, Artist ID, Type ID empty (optional)
5. Click "Create Comic"

**Expected Results:**

- Form validates all required fields
- Slug auto-generates to "attack-on-titan"
- Redirects to edit page (ID assigned, e.g., `/admin/comics/1`)
- Comic appears in list on next visit
- Toast notification confirms creation (if implemented)

**Validation Tests:**

- Try submitting with empty title: Should show error "Title must be at least 3
  characters"
- Try submitting with title <3 chars: Should show error
- Try submitting with invalid URL: Should show "Cover image must be a valid URL"
- Try duplicate title: Should work (only slug must be unique)

---

### Scenario 2: View Comics List

**Steps:**

1. Navigate to `/admin/comics`
2. Observe the table displaying all comics
3. Check pagination controls

**Expected Results:**

- Table shows: Cover image, Title, Slug, Status badge, Views count, Created date
- Status badges are color-coded:
  - Ongoing = Blue
  - Hiatus = Yellow
  - Completed = Green
  - Dropped = Red
  - Coming Soon = Purple
- Pagination controls visible at bottom
- "New Comic" button in top right
- Search box at top

---

### Scenario 3: Edit a Comic

**Steps:**

1. From comics list, click the pencil/edit icon on any comic
2. You're taken to `/admin/comics/[id]` page
3. Form pre-fills with existing data
4. Make changes:
   - Change title to "Attack on Titans: Revised"
   - Change status to "Hiatus"
5. Click "Update Comic"

**Expected Results:**

- Form pre-fills correctly with all fields
- Changes are saved
- Toast notification confirms update
- Can navigate back to list and see updated title/status

**Read-Only Field Tests:**

- ID, Created Date, Updated Date should be displayed but not editable
- These fields should be in a separate section marked "Danger Zone" for delete

---

### Scenario 4: Delete a Comic

**Steps:**

1. On edit page (`/admin/comics/[id]`), scroll to bottom
2. Find "Danger Zone" section with red "Delete Comic" button
3. Click the delete button
4. Confirm in the modal dialog
5. Click "Delete" in the confirmation modal

**Expected Results:**

- Modal appears asking for confirmation
- Clicking "Delete" removes comic from database
- Redirects to `/admin/comics` list
- Comic no longer appears in table
- Toast notification confirms deletion

**Alternative Delete Path:**

1. From list page, click trash icon on any comic row
2. Confirmation modal appears
3. Confirm deletion
4. Comic removed from table

---

### Scenario 5: Search Comics

**Steps:**

1. On comics list page `/admin/comics`
2. In search box, type "attack"
3. Click "Search" button
4. Observe table updates with filtered results

**Expected Results:**

- Only comics with "attack" in title are shown
- URL changes to `/admin/comics?q=attack`
- Can still navigate back and search stays in input
- Clearing search returns to full list

**Edge Cases:**

- Search for non-existent term: Shows "No comics found" message
- Search with special characters: Should handle safely
- Case-insensitive search: "Attack" finds "attack on titan"

---

### Scenario 6: Pagination

**Steps:**

1. On comics list with multiple pages
2. Scroll to bottom pagination controls
3. Click "Next" button (right arrow)

**Expected Results:**

- Page number increments
- New batch of 25 comics displayed
- "Previous" button enabled (if not on first page)
- "Next" button disabled when on last page

---

### Scenario 7: Image Upload

**Steps:**

1. On create/edit form
2. In "Cover Image" section, click "Choose Image" button
3. Select an image file from your computer (JPG, PNG, etc.)
4. Observe upload progress

**Expected Results:**

- Progress bar shows upload status (0-100%)
- Image preview appears after successful upload
- Image URL auto-fills in the URL field
- Upload completes without errors

**Validation Tests:**

- Try uploading file >10MB: Should show size error
- Try uploading non-image file (PDF): Should show format error
- Try uploading animated GIF: Should work (if supported)

---

### Scenario 8: Form Validation

**Test each field:**

**Title Field:**

- ✓ Empty = Error "Title must be at least 3 characters"
- ✓ 2 chars = Error
- ✓ 3+ chars = Valid
- ✓ 512+ chars = Error "Title must not exceed 512 characters"

**Description Field:**

- ✓ Empty = Error "Description is required"
- ✓ <10 chars = Error
- ✓ 10+ chars = Valid
- ✓ 5000+ chars = Error

**Slug Field:**

- ✓ "valid-slug" = Valid
- ✓ "Invalid Slug!" = Error "Slug must be lowercase with hyphens only"
- ✓ "UPPERCASE" = Error
- ✓ "duplicate-slug" (already exists) = Error "A comic with this slug already
  exists"

**Cover Image Field:**

- ✓ "not-a-url" = Error "Cover image must be a valid URL"
- ✓ "https://example.com/image.jpg" = Valid
- ✓ Empty = Error "Cover image is required"

**Status Field:**

- ✓ All 5 options should be selectable
- ✓ Default is "Ongoing"

**Publication Date Field:**

- ✓ Required field
- ✓ Any valid date = Valid
- ✓ Future dates = Valid

---

### Scenario 9: Bulk Selection

**Steps:**

1. On comics list page
2. Check the checkbox in the header to select all
3. Individual comics become checked
4. Selection counter appears

**Expected Results:**

- Header checkbox toggles all rows
- Individual checkboxes can be toggled
- Counter shows "N selected"
- Delete button appears when items selected

**Note:** Bulk delete may not be fully implemented yet.

---

### Scenario 10: Navigation Flow

**Test the complete flow:**

1. Start at `/admin/comics`
2. Click "New Comic"
3. Create a comic, get redirected to `/admin/comics/[id]`
4. Click "Cancel" button
5. Should go back to previous page
6. Create another comic
7. Edit it (pencil icon)
8. Change something
9. Click "Update"
10. Verify it changed in the list
11. Delete it
12. Verify removed from list

**Expected Results:**

- All navigation works smoothly
- Browser back button works
- No errors in console
- Data persists correctly

---

## Edge Cases & Error Handling

### Database Issues

- **No database connection**: Should show connection error
- **Duplicate slug**: Should prevent creation with helpful message
- **Orphaned image URLs**: Should still display (no cascade delete)

### Form Issues

- **Network timeout during upload**: Should show error and allow retry
- **Validation errors**: Should prevent submission and highlight fields
- **Server errors**: Should show user-friendly error message

### Concurrency

- **Edit while another user deletes**: Should handle gracefully
- **Rapid submissions**: Should prevent double-submit

---

## Performance Checklist

- [ ] Pagination loads within 2 seconds
- [ ] Search results appear within 3 seconds
- [ ] Image upload shows progress feedback
- [ ] No console errors during normal operations
- [ ] Responsive on mobile (<375px width)
- [ ] Responsive on tablet (768px width)
- [ ] Responsive on desktop (1920px width)

---

## Accessibility Checklist

- [ ] All form fields are labeled
- [ ] Error messages are visible and descriptive
- [ ] Tab navigation works through form
- [ ] Buttons have clear labels
- [ ] Color is not the only indicator (status badge + text)
- [ ] Keyboard enter triggers form submission
- [ ] Escape key closes modals

---

## Browser Testing

Test in:

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

---

## Success Criteria

✅ All CRUD operations work without errors ✅ Form validation prevents invalid
data entry ✅ Images upload successfully ✅ Pagination works correctly ✅ Search
filters results as expected ✅ Delete confirmation prevents accidental deletion
✅ No console errors ✅ Responsive design works ✅ Toast notifications appear
(if implemented) ✅ Data persists after refresh

---

## Troubleshooting

**Problem:** "No comics found" but I created one

- Solution: Refresh the page or check database directly

**Problem:** Image upload fails

- Solution: Check file size (<10MB) and format (JPG/PNG/WebP/GIF)

**Problem:** Slug validation error

- Solution: Use only lowercase letters, numbers, and hyphens (no spaces)

**Problem:** Form won't submit

- Solution: Check console for validation errors, fill all required fields

**Problem:** Delete doesn't work

- Solution: Confirm in the modal dialog, check console for errors

---

**Test Date**: **\*\***\_\_\_**\*\*** **Tested By**: **\*\***\_\_\_**\*\***
**Results**: ✅ PASS / ❌ FAIL **Notes**:
**\*\*\*\***\*\*\*\***\*\*\*\***\_\_\_**\*\*\*\***\*\*\*\***\*\*\*\***
