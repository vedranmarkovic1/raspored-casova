// SQL Functions for Supabase

export const authFunctions = `
-- Hash password function
CREATE OR REPLACE FUNCTION hash_password(plain_password TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN crypt(plain_password, gen_salt('bf'));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verify password function
CREATE OR REPLACE FUNCTION verify_password(plain_password TEXT, hashed_password TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (hashed_password = crypt(plain_password, hashed_password));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
`
