-- ============================================
-- Run this in Supabase Dashboard > SQL Editor
-- Creates the team_members table + seeds data
-- ============================================

CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  email TEXT,
  image TEXT NOT NULL,
  bio TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'Active',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Anyone can read team members (public about page)
CREATE POLICY "Public can read team members"
  ON team_members FOR SELECT
  USING (true);

-- Auth users can manage team members (admin)
CREATE POLICY "Auth users can insert team members"
  ON team_members FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Auth users can update team members"
  ON team_members FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Auth users can delete team members"
  ON team_members FOR DELETE
  TO authenticated
  USING (true);

-- Seed with existing about page data
INSERT INTO team_members (name, role, image, bio, status, sort_order)
VALUES
  (
    'Umar Abdullahi, OFR.',
    'Chairman / Chief Executive Officer',
    '/images/ceo.jpg',
    ARRAY[
      'A visionary leader with over two decades of experience in real estate development, finance, and investment.',
      'Under his leadership, the company has grown into a formidable force in the Nigerian real estate sector, delivering premium luxury homes.',
      'He holds a degree in Business Administration and has attended numerous executive management courses globally.'
    ],
    'Active', 1
  ),
  (
    'Elizabeth Taylor',
    'Executive Director',
    'https://media.istockphoto.com/id/1479648645/photo/close-up-portrait-of-a-beautiful-female-creative-specialist-with-curly-hair-smiling-young.jpg?s=2048x2048&w=is&k=20&c=uLtV-AuOQUJuxLkVn69lH4pNu2YvdaMBjJxNVXG81sM=',
    ARRAY[
      'Elizabeth brings a wealth of experience in corporate strategy, operations, and human capital management.',
      'She has been instrumental in driving the company''s growth and ensuring operational excellence across all departments.',
      'An alumnus of Harvard Business School, she is passionate about building high-performing teams.'
    ],
    'Active', 2
  ),
  (
    'Engr. Baba Kalli',
    'Chief Technical Officer',
    'https://media.istockphoto.com/id/1796523257/photo/carefree-mature-woman-laughing-against-a-gray-background.jpg?s=2048x2048&w=is&k=20&c=na6TF5tKVr0mJB9mdpROlvLIl-HWggNvAdn_ICAt0j0=',
    ARRAY[
      'A veteran engineer with extensive experience in structural design and construction management.',
      'Engr. Baba oversees all technical aspects of our projects, ensuring they meet the highest standards of quality and safety.',
      'He is a registered member of the Council for the Regulation of Engineering in Nigeria (COREN).'
    ],
    'Active', 3
  ),
  (
    'Engr. Madhur Tripathi',
    'Chief Innovation Officer',
    'https://media.istockphoto.com/id/2209704555/photo/successful-business-team.jpg?s=2048x2048&w=is&k=20&c=Cy2uJEQzomTLWcPcaFJ4PW_sgJj8Rt5sCrKgRMMcT50=',
    ARRAY[
      'Leading our smart home technology and automation initiatives.',
      'Madhur ensures that every home we build is equipped with cutting-edge technology for maximum comfort and security.',
      'With a background in electronics and communication engineering, he brings a unique perspective to real estate development.'
    ],
    'Active', 4
  ),
  (
    'Barr. Adeoba Ademoyega',
    'Legal Counsel',
    'https://media.istockphoto.com/id/1082416078/photo/always-positive-always-productive.jpg?s=2048x2048&w=is&k=20&c=ew1kWgVTK7Aw25NWl_1fMhBDABOyp6U9vHzS7FdzWhU=',
    ARRAY[
      'A seasoned legal practitioner specializing in property law and corporate governance.',
      'Barr. Adeoba handles all legal matters, ensuring compliance with regulatory requirements and protecting the company''s interests.',
      'He is a member of the Nigerian Bar Association with over 15 years of active practice.'
    ],
    'Active', 5
  ),
  (
    'Raymond Ricketts',
    'General Manager, Operations',
    'https://media.istockphoto.com/id/1073787868/photo/portrait-of-young-businessman-in-office-with-tablet-smiling.webp?a=1&b=1&s=612x612&w=0&k=20&c=SvwR4tPddWxCme4kKtiaBV05oZCiJoW2pV9f92k7tHg=',
    ARRAY[
      'Overseeing the day-to-day operations and ensuring seamless project execution.',
      'Raymond''s expertise in logistics and supply chain management has been vital to our timely project delivery.',
      'He is committed to maintaining the highest standards of efficiency and customer satisfaction.'
    ],
    'Active', 6
  );
