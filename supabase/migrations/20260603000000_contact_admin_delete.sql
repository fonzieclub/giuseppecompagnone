create policy "Admins can delete contact requests"
  on public.contact_requests for delete
  using (public.is_admin());
