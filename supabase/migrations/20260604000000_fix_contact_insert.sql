-- Allow anonymous visitors to submit the contact form
grant insert on public.contact_requests to anon, authenticated;
grant select, delete on public.contact_requests to authenticated;

drop policy if exists "Anyone can submit contact request" on public.contact_requests;

create policy "Anyone can submit contact request"
  on public.contact_requests for insert
  to anon, authenticated
  with check (true);
