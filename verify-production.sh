#!/bin/bash
# Production Readiness Verification Script
# Run this script to verify all production components are in place

echo "🔍 geoListed Production Readiness Check"
echo "=========================================="
echo ""

# Track results
PASSED=0
FAILED=0

# Helper functions
check_file() {
  if [ -f "$1" ]; then
    echo "✅ $2 found at $1"
    ((PASSED++))
  else
    echo "❌ $2 MISSING at $1"
    ((FAILED++))
  fi
}

check_dir() {
  if [ -d "$1" ]; then
    echo "✅ $2 found at $1"
    ((PASSED++))
  else
    echo "❌ $2 MISSING at $1"
    ((FAILED++))
  fi
}

# Database Migrations
echo "📊 Database Migrations:"
check_file "supabase/migrations/20260630000000_fix_businesses_rls.sql" "RLS migration"
check_file "supabase/migrations/20260630000001_businesses_public_view.sql" "Public view migration"
check_file "supabase/migrations/20260630000002_add_smtp_settings.sql" "SMTP settings migration"
check_file "supabase/migrations/20260630000003_search_vector_index.sql" "Search index migration"
check_file "supabase/migrations/20260630000004_image_storage.sql" "Image storage migration"
echo ""

# Edge Functions
echo "⚡ Edge Functions:"
check_file "supabase/functions/mcp-server/index.ts" "MCP server"
check_file "supabase/functions/send-email/index.ts" "Email function"
check_file "supabase/functions/_shared/rateLimit.ts" "Rate limiting"
check_file "supabase/functions/_shared/authSecurity.ts" "Auth security"
check_file "supabase/functions/_shared/emailTemplates.ts" "Email templates"
check_file "supabase/functions/sslcz-ipn/index.ts" "Payment webhook"
check_file "supabase/functions/hibp-check/index.ts" "Password breach check"
echo ""

# Frontend Components
echo "🎨 Frontend Components:"
check_file "src/pages/Listings.tsx" "Listings page"
check_file "src/pages/Home.tsx" "Home page"
check_file "src/pages/BusinessProfile.tsx" "Business profile"
check_file "src/pages/CategoryDetail.tsx" "Category detail"
check_file "src/pages/Admin.tsx" "Admin dashboard"
check_file "src/pages/SuperAdmin.tsx" "Super admin"
check_file "src/pages/AdminMCP.tsx" "MCP admin"
check_file "src/components/ReviewsModerationUI.tsx" "Reviews moderation UI"
check_file "src/components/BusinessCard.tsx" "Business card"
echo ""

# Documentation
echo "📚 Documentation:"
check_file "PRODUCTION_DEPLOYMENT.md" "Deployment guide"
check_file "SECURITY_HARDENING.md" "Security audit"
check_file "COMPLETION_REPORT.md" "Completion report"
check_file "IMPLEMENTATION_SUMMARY.md" "Implementation summary"
echo ""

# Directories
echo "📁 Directory Structure:"
check_dir "src/pages" "Pages directory"
check_dir "src/components" "Components directory"
check_dir "supabase/functions" "Functions directory"
check_dir "supabase/migrations" "Migrations directory"
echo ""

# Summary
echo "=========================================="
echo "📊 Verification Summary:"
echo "   ✅ Passed: $PASSED"
echo "   ❌ Failed: $FAILED"
echo ""

if [ $FAILED -eq 0 ]; then
  echo "🎉 All production components verified!"
  echo "Ready for deployment!"
  exit 0
else
  echo "⚠️  Some components are missing."
  echo "Review the failures above."
  exit 1
fi
